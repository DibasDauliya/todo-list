const express = require('express')
const bodyParser = require('body-parser')
const date = require(`${__dirname}/date.js`)

const app = express()



app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

let tasks = [
  'hiii hihihihih ihi h hi hi h ih iii hihihihih ihi h hi hi h ih iii hihihihih ihi h hi hi h ih i',
  'hi'
]
let works = []

app.get('/', (req, res) => {
  
  const day = date.getDate()

  res.render('list', {title: day, tasks: tasks })
})

app.post('/', (req, res) => {
  const task = req.body.task

  if (req.body.button === 'Work') {
    works.push(task)
    res.redirect('/work')
  } else {
    tasks.push(task)
  res.redirect('/')
  }

  console.log(req.body.button);

})

app.get('/work', (req, res) => {
  res.render('list', {title: 'Work', tasks: works })
})

app.get('/about', (req, res)=> {
  res.render('about')
})

app.listen(3000, () => console.log('Server is running in port 3000.'))
