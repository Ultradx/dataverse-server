const {
  getArticles,
  getArticle,
  createArticle,
  getNoContentArticles,
  getSpecificArticles,
  editArticle,
  deleteArticle
} = require('../controllers/articles')

const express = require('express')
const router = express.Router()

router.get('/', getArticles)
router.get('/noContent/:id', getArticle)
router.get('/noContent', getNoContentArticles)
router.get('/:id', getArticle)
router.post('/specificArticles', getSpecificArticles)
router.post('/newArticle', createArticle)
router.post('/editArticle', editArticle)
router.delete('/deleteArticle/:id',deleteArticle)


module.exports = router
