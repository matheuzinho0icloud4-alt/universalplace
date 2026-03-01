const productService = require("../services/productService")
const config = require("../config")

async function create(req, res, next) {
  try {
    const { name, link_oferta } = req.body
    console.log('📦 [CREATE] Body received:', { name, link_oferta })
    
    // determine base for public URLs; prefer config.baseUrl if set (e.g. render secret)
    const base = config.baseUrl || `${req.protocol}://${req.get('host')}`;
    const image = req.file
      ? `${base}/uploads/${encodeURIComponent(req.file.filename)}`
      : null
    console.log('📷 [CREATE] Image:', image)
    
    const prod = await productService.create({ name, image, link_oferta }, req.user.id)
    console.log('✅ [CREATE] Product created:', prod.id)
    res.json(prod)
  } catch (err) {
    console.error('❌ [CREATE] Error:', err.message)
    next(err)
  }
}

async function list(req, res, next) {
  try {
    let prods;
    if (req.user) {
      prods = await productService.listByUser(req.user.id)
      console.log(`📦 [LIST] User ${req.user.id} has ${prods.length} products`)
    } else {
      prods = await productService.listAll()
      console.log(`📦 [LIST] Total products available: ${prods.length}`)
    }

    // previously we repaired old URLs in development; in production
    // images are generated dynamically so this step is unnecessary.
    // prods = prods.map(p => p); // no-op

    res.json(prods)
  } catch (err) {
    console.error('❌ [LIST] Error:', err.message)
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const { name, link_oferta } = req.body
    console.log('📝 [UPDATE] Body received:', { name, link_oferta })
    
    const updates = { name, link_oferta }
    if (req.file) {
      const base = config.baseUrl || `${req.protocol}://${req.get('host')}`;
      updates.image = `${base}/uploads/${encodeURIComponent(req.file.filename)}`
      console.log('📷 [UPDATE] New image:', updates.image)
    }
    
    // service now returns { old, updated }
    const { old, updated } = await productService.update(req.params.id, req.user.id, updates)
    if (!updated) {
      console.warn(`⚠️ [UPDATE] Product ${req.params.id} not found or not authorized`)
      return res.status(404).json({ error: 'Not found or not authorized' })
    }

    // cleanup previous image if it was replaced
    if (old && old.image && updates.image && old.image !== updates.image) {
      const { removeUpload } = require('../utils/fileUtils')
      // fire and forget, don't block the response
      removeUpload(old.image).catch(err => {
        console.error('❌ [UPDATE] Failed to remove old image:', err.message)
      })
    }

    console.log('✅ [UPDATE] Product updated:', updated.id)
    res.json(updated)
  } catch (err) {
    console.error('❌ [UPDATE] Error:', err.message)
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    console.log(`🗑️ [DELETE] Removing product ${req.params.id}`)
    const { old, count } = await productService.remove(req.params.id, req.user.id)
    if (!count) {
      console.warn(`⚠️ [DELETE] Product ${req.params.id} not found or not authorized`)
      return res.status(404).json({ error: 'Not found or not authorized' })
    }

    // remove associated image file if present
    if (old && old.image) {
      const { removeUpload } = require('../utils/fileUtils')
      removeUpload(old.image).catch(err => {
        console.error('❌ [DELETE] Failed to remove image:', err.message)
      })
    }

    console.log(`✅ [DELETE] Product ${req.params.id} deleted successfully`)
    res.json({ success: true })
  } catch (err) {
    console.error('❌ [DELETE] Error:', err.message)
    next(err)
  }
}

module.exports = { create, list, update, remove }