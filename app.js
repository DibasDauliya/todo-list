const express = require('express')
const bodyParser = require('body-parser')
const date = require(`${__dirname}/date.js`)
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express()

let paramName = ''

// connect databse
mongoose.connect(
  'mongodb+srv://admin-dibas:Test-123@test.ngng4.mongodb.net/todolistDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

const itemsSchema = new mongoose.Schema({
  name: String
})

const Task = mongoose.model('Task', itemsSchema)

// for params
const paramsSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})

const Param = mongoose.model('Param', paramsSchema)
// for params ends

const taskOne = Task({
  name: 'Hi welcome'
})
const taskTwo = Task({
  name: 'This is todo list'
})
const taskThree = Task({
  name: '<-- click here to delete'
})

const defaultTask = [taskOne, taskTwo, taskThree]

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

let works = []

app.get('/', (req, res) => {
  const day = date.getDate()

  Task.find((err, results) => {
    if (err) {
      console.error(err)
    } else {
      if (results.length === 0) {
        Task.insertMany(defaultTask, (err) =>
          err ? console.error(err) : console.log('Added successfully')
        )
        res.redirect('/')
      } else {
        res.render('list', { title: 'Today', tasks: results })
      }
    }
  })
})

app.post('/', (req, res) => {
  const task = req.body.task

  const btnValueIETitle = req.body.button

  const postTask = Task({
    name: task
  })

  if (btnValueIETitle === 'Today') {
    postTask.save()
    res.redirect('/')
  } else {
    Param.findOne({ name: btnValueIETitle }, (err, foundList) => {
      if (!err) {
        foundList.items.push(postTask)
        foundList.save()
        res.redirect(`/${btnValueIETitle}`)
      }
    })
  }
})

app.post('/delete', (req, res) => {
  // console.log(req.body.checkbox)
  const title = req.body.hidden
  if (title === 'Today') {
    Task.findByIdAndRemove(req.body.checkbox, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('deleted successfully')
        res.redirect('/')
      }
    })
  } else {
    Param.findOneAndUpdate(
      { name: title },
      { $pull: { items: { _id: req.body.checkbox } } },
      (err, foundList) => {
        if (!err) {
          console.log('deleted param')
          res.redirect(`/${title}`)
        }
      }
    )
  }
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/:paramName', (req, res) => {
  paramName = _.capitalize(req.params.paramName)

  Param.findOne({ name: paramName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const pdata = Param({
          name: paramName,
          items: defaultTask
        })

        pdata.save()

        res.redirect(`/${paramName}`)
      } else {
        res.render('list', { title: paramName, tasks: foundList.items })
      }
    }
  })
})

app.listen(3000, () => console.log('Server is running in port 3000.'))
