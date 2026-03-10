const categoryService = require("../services/categoryService")
const { z } = require('zod')
const logger = require('../utils/logger')

const CategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  show_home: z.boolean().optional(),
  home_order: z.number().int().min(0).optional(),
})

async function create(req, res, next) {
  try {
    const parsed = CategorySchema.safeParse(req.body)
    if (!parsed.success) {
      const err = new Error('Invalid category payload')
      err.status = 400
      err.errorCode = 'INVALID_PAYLOAD'
      err.meta = parsed.error.format()
      return next(err)
    }

    const category = await categoryService.create(parsed.data)
    logger.info('Category created: %s', category.id)
    res.status(201).json({ success: true, data: category, message: 'Category created successfully' })
  } catch (err) {
    logger.error('CREATE category error: %o', err)
    next(err)
  }
}

async function list(req, res, next) {
  try {
    const categories = await categoryService.listAll()
    res.json({ success: true, data: categories })
  } catch (err) {
    logger.error('LIST categories error: %o', err)
    next(err)
  }
}

async function listForHome(req, res, next) {
  try {
    const categories = await categoryService.listForHome()
    res.json({ success: true, data: categories })
  } catch (err) {
    logger.error('LIST categories for home error: %o', err)
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const parsed = CategorySchema.partial().safeParse(req.body)
    if (!parsed.success) {
      const err = new Error('Invalid category payload')
      err.status = 400
      err.errorCode = 'INVALID_PAYLOAD'
      err.meta = parsed.error.format()
      return next(err)
    }

    const category = await categoryService.update(req.params.id, parsed.data)
    if (!category) {
      const err = new Error('Category not found')
      err.status = 404
      err.errorCode = 'NOT_FOUND'
      return next(err)
    }

    logger.info('Category updated: %s', category.id)
    res.json({ success: true, data: category, message: 'Category updated successfully' })
  } catch (err) {
    logger.error('UPDATE category error: %o', err)
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    const count = await categoryService.remove(req.params.id)
    if (!count) {
      const err = new Error('Category not found')
      err.status = 404
      err.errorCode = 'NOT_FOUND'
      return next(err)
    }

    logger.info('Category deleted: %s', req.params.id)
    res.json({ success: true, data: null, message: 'Category deleted successfully' })
  } catch (err) {
    logger.error('DELETE category error: %o', err)
    next(err)
  }
}

module.exports = { create, list, listForHome, update, remove }