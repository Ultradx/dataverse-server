const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


// ------------Routers-----------------
const articlesRoutes = require('./routes/articles')
const categoriesRoutes = require('./routes/categories')


const app = express()
const port = 8080

// parse application/json
app.use(bodyParser.json()) 
app.use(cors())


//---------------------------Mongoose----------------------------------
const mongoose = require('mongoose');
const res = require("express/lib/response");
mongoose.connect('mongodb+srv://Aldo:aldo123@cluster0.35kk7.mongodb.net/Cluster0?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))
//---------------------------End Mongoose-------------------------------
app.use('/articles', articlesRoutes)
app.use('/categories', categoriesRoutes)
app.all('*', (req, res) => res.send("That route doesn't exist")) // Επιστροφη μυνηματος αν δεν υπαχρει το path

app.listen(port, () =>
  console.log(`Server is listening on port: http://localhost:${port}`),
)
