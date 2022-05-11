const { getCategories, createCategory, deleteCategory } = require('../controllers/categories')

const express = require('express')
const router = express.Router()

router.get('/', getCategories)
router.post('/:id', createCategory)
router.delete('/', deleteCategory)

module.exports = router
