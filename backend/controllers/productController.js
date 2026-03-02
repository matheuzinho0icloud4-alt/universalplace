const productService = require("../services/productService")
const config = require("../config")
const logger = require('../utils/logger')

async function create(req, res, next) {
  try {
    const { name, link_oferta } = req.body
    logger.debug('CREATE body: %o', { name, link_oferta })
    
    // determine base for public URLs; prefer config.baseUrl if set (e.g. render secret)
    const base = config.baseUrl || `${req.protocol}://${req.get('host')}`;
    const image = req.file
      ? `${base}/uploads/${encodeURIComponent(req.file.filename)}`
      : null
    logger.debug('CREATE image: %s', image)
    
    const prod = await productService.create({ name, image, link_oferta }, req.user.id)
    logger.info('Product created: %s by user %s', prod.id, req.user?.id)
    res.json({ success: true, product: prod })
  } catch (err) {
    logger.error('CREATE error: %o', err)
    next(err)
  }
}

async function list(req, res, next) {
  try {
    let prods;
    if (req.user) {
      prods = await productService.listByUser(req.user.id)
      logger.debug('LIST: user %s products %d', req.user.id, prods.length)
    } else {
      prods = await productService.listAll()
      logger.debug('LIST: total products %d', prods.length)
    }

    // previously we repaired old URLs in development; in production
    // images are generated dynamically so this step is unnecessary.
    // prods = prods.map(p => p); // no-op

    res.json({ success: true, products: prods })
  } catch (err) {
    logger.error('LIST error: %o', err)
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const { name, link_oferta } = req.body
    logger.debug('UPDATE body: %o', { name, link_oferta })
    
    const updates = { name, link_oferta }
    if (req.file) {
      const base = config.baseUrl || `${req.protocol}://${req.get('host')}`;
      updates.image = `${base}/uploads/${encodeURIComponent(req.file.filename)}`
      logger.debug('UPDATE image: %s', updates.image)
    }
    
    // service now returns { old, updated }
    const { old, updated } = await productService.update(req.params.id, req.user.id, updates)
    if (!updated) {
      const err = new Error('Not found or not authorized')
      err.status = 404
      err.errorCode = 'NOT_FOUND'
      return next(err)
    }

    // cleanup previous image if it was replaced
    if (old && old.image && updates.image && old.image !== updates.image) {
      const { removeUpload } = require('../utils/fileUtils')
      // fire and forget, don't block the response
      removeUpload(old.image).catch(e => logger.warn('Failed to remove old image: %o', e))
    }

    logger.info('Product updated: %s', updated.id)
    res.json({ success: true, product: updated })
  } catch (err) {
    logger.error('UPDATE error: %o', err)
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    logger.info('DELETE product %s by user %s', req.params.id, req.user?.id)
    const { old, count } = await productService.remove(req.params.id, req.user.id)
    if (!count) {
      const err = new Error('Not found or not authorized')
      err.status = 404
      err.errorCode = 'NOT_FOUND'
      return next(err)
    }

    // remove associated image file if present
    if (old && old.image) {
      const { removeUpload } = require('../utils/fileUtils')
      removeUpload(old.image).catch(e => logger.warn('Failed to remove image: %o', e))
    }

    logger.info('Product %s deleted', req.params.id)
    res.json({ success: true })
  } catch (err) {
    logger.error('DELETE error: %o', err)
    next(err)
  }
}

module.exports = { create, list, update, remove }