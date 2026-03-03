const productService = require("../services/productService")
const config = require("../config")
const logger = require('../utils/logger')

async function create(req, res, next) {
  try {
    const { name, image, description, product_link, link_oferta } = req.body
    // accept both `product_link` and legacy `link_oferta` (prefer product_link)
    const finalLink = product_link || link_oferta || null
    logger.debug('CREATE body: %o', { name, image, description, product_link: finalLink })

    // image is expected to be an external URL string (or null)
    const prod = await productService.create({ name, image, description, product_link: finalLink }, req.user.id)
    logger.info('Product created: %s by user %s', prod.id, req.user?.id)
    res.status(201).json({ success: true, data: prod, message: 'Product created successfully' })
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

    res.json({ success: true, data: prods })
  } catch (err) {
    logger.error('LIST error: %o', err)
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const { name, image, description, product_link, link_oferta } = req.body
    const finalLink = product_link || link_oferta || null
    logger.debug('UPDATE body: %o', { name, image, description, product_link: finalLink })

    const updates = { name, image, description, product_link: finalLink }
    
    // service now returns { old, updated }
    const { old, updated } = await productService.update(req.params.id, req.user.id, updates)
    if (!updated) {
      const err = new Error('Not found or not authorized')
      err.status = 404
      err.errorCode = 'NOT_FOUND'
      return next(err)
    }

    // no local file cleanup required (images are external URLs)

    logger.info('Product updated: %s', updated.id)
    res.json({ success: true, data: updated, message: 'Product updated successfully' })
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

    // no local file cleanup required (images are external URLs)

    logger.info('Product %s deleted', req.params.id)
    res.json({ success: true, data: null, message: 'Product deleted successfully' })
  } catch (err) {
    logger.error('DELETE error: %o', err)
    next(err)
  }
}

module.exports = { create, list, update, remove }