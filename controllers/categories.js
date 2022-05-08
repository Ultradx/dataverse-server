const Article = require('../models/article')
const Category = require('../models/category')


// Επιστρεφει τις κατηγοριες
const getCategories = async (req, res) => {
  let query = Category.find()
  try {
    const categories = await query.exec()
    console.log('send category')
    res.send(categories)
  } catch {
    res.redirect('/')
  }
}

// Αφου κανει ελεγχο των πεδιων και δει οτι δεν υπαρχει αλλη κατηγορια με το ιδιο ονομα το αποθηκευει στην συλλογη 
const createCategory = async (req, res) => {
  let category
  try {
    const check_name = req.body.name
    console.log('Im in createCategory ')

    if (check_name !== undefined || check_name !== '') {
      console.log(check_name)

      const categoryFound = await Category.findOne({
        name: req.body.name,
      })
      if (categoryFound) {
        console.log('Found')
        res.status(201).send('Category with that name already exists')
      } else {
        category = new Category({
          name: req.body.name,
        })

        await category.save()
        res.send(`${check_name} Added Successfully!`)
      }
    }
    // res.redirect(`/`)
  } catch {
    res.redirect(`/`)
  }
}

// Διαγραφη κατηγοριας σε περιπτωσει που υπαρχει στην συλλογη
// Ωστοσο αν υπαρχει καποιο αρθρο που να εχεο αυτην την κατηγορια τοτε γινεται αποτυχια
const deleteCategory = async (req, res) => {
  try {
    console.log('Im in delete ')
    const check_name = req.body.name

    if (check_name !== undefined || check_name !== '') {
      console.log(check_name)

      const categoryFound = await Category.findOne({
        name: check_name,
      })
      if (!categoryFound) {
        res.status(201).send('Category with that name doesnt exist!')
      } else {
        let articles = await Article.find({ category: categoryFound })
        console.log(articles);
        if (articles.length > 0) {
          res.status(202).send('Faild There are articles with that category!')
        } else {
          await categoryFound.remove()
          res.status(200).send(`Category ${check_name} Deleted Successfully!`)
        }
      }
    } else {
      res.send('Please Insert Category Name!')
    }
  } catch {
    res.send('Error Deleting Category')
  }
}

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
}
