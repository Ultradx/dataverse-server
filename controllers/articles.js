const Article = require('../models/article')
const Category = require('../models/category')


// Συναρτηση που αναζητα με βαση το id ενα συκγεκριμενο αρθρο και το στελνει στον client
const getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).exec()
    res.send(article)
  } catch {
    res.send('Error getArticle')
  }
}

// Στελνει ολα τα articles
const getArticles = async (req, res) => {
  let query = Article.find()
  try {
    const articles = await query.exec()
    res.send(articles)
  } catch {
    res.redirect('/')
  }
}

// Σε περιπτωση που ο χρηστης δεν θελει το content τοτε καλειται αυτη η συναρτηση
const getNoContentArticles = async (req, res) => {
  let query = Article.find({}, { title: 1, description: 1, category: 1 })
  try {
    const articles = await query.exec()
    res.send(articles)
  } catch {
    res.redirect('/')
  }
}

/**
 * Συναρτηση editArticle που αφου το δωθει το id προσπαθει να βρει το αρθρο
 * με το συκγεκριμενο id και να κανει update μονο το content 
 */
const editArticle = async (req, res) => {
  let findid = req.body.id
  try {
    if (findid != undefined || findid != '') {
      const article = await Article.findById(findid).exec()
      if (article) {
        await Article.updateOne(
          {
            _id: article._id,
          },
          {
            $set: {
              content: req.body.content,
            },
          },
        )
        res.send('Article Updated Succesfully!')
      } else {
        res.send('Article Not Found')
      }
    }
  } catch (error) {
    res.send('Error Edit Article')
  }
}

// Αυτην την φορα του δινουμε παραμετρο απο το query μας το id και στην συνεχεια αφου το βρει το κανει delete
const deleteArticle = async (req, res) => {
  let article
  try {
    article = await Article.findById(req.params.id)
    if (article != null) {
      await article.remove()
      res.send('Article Deleted Succesfully!')
    } else {
      res.send('Article ID Not Found!')
    }
  } catch {
    res.send('Error Deleting Article')
  }
}


/**
 * Συναρτηση createArticle
 * Αφου ελέγξει οτι το description υπαρχει η οχι και αναλογα
 * καλει τον τροπο που θα αποθηκευσει το αρθρο
 */
const createArticle = async (req, res) => {
  let article
  try {
    const check_desc = req.body.description
    console.log('Im here createArticle')

    const categoryFound = await Category.findOne({
      name: req.body.category,
    })

    if (categoryFound) {
      console.log('Im here category Found')
      if (!check_desc == undefined || !check_desc == '') {
        console.log(check_desc)

        article = new Article({
          title: req.body.title,
          content: req.body.content,
          description: req.body.description,
          category: categoryFound,
        })

        await article.save()
        res.send('Article Created Successfully!')
      } else {
        article = new Article({
          title: req.body.title,
          content: req.body.content,
          category: categoryFound,
        })
        await article.save()
        res.send('Article Created Successfully!')
      }
    } else {
      res.send('Error Finding Category!')
    }

    // res.redirect(`/articles`)
  } catch {
    // res.redirect(`/articles`)
    res.send('Error')
  }
}

/**
 * Η συναρτηση αυτη ενωνει τα δυο collections articles και categories 
 * και αναλογα αν ο χρηστης εχει ορισει κατηγορια η οχι καλει το pipeline η οχι
 * και επιστρεφει τα αποτελεσματα στον χρηστη
 */
const getSpecificArticles = async (req, res) => {
  console.log('getSpecificArticles')
  let query
  let findCategory = req.body.category
  console.log(findCategory)
  try {
    if (findCategory == undefined || findCategory == '') {
      query = Article.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
      ])
    } else {
      query = Article.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            pipeline: [{ $match: { name: req.body.category } }],
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
      ])
    }
    const categories = await query.exec()
    // let queryArticles = Article.find({name: req.body.category})
    if (categories.length > 0) {
      res.send(categories)
    } else {
      res.status(201).send('No Article With That Category Found!')
    }
  } catch {
    res.redirect('/')
  }
}

module.exports = {
  getArticles,
  getArticle,
  createArticle,
  getNoContentArticles,
  getSpecificArticles,
  editArticle,
  deleteArticle,
}
