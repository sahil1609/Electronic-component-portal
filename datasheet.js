const express = require('express')
const Datasheet = require('./../models/datasheet')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('datasheet/new', { datasheet: new Datasheet() })
})

router.get('/edit/:id', async (req, res) => {
  const datasheet = await Datasheet.findById(req.params.id)
  res.render('datasheet/edit', { datasheet: datasheet })
})

router.get('/:slug', async (req, res) => {
  const datasheet = await Datasheet.findOne({ slug: req.params.slug })
  if (datasheet == null) res.redirect('/')
  res.render('datasheet/show', { datasheet: datasheet })
})

router.post('/', async (req, res, next) => {
  req.datasheet = new Datasheet()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.datasheet = await Datasheet.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Datasheet.findByIdAndDelete(req.params.id)
  res.redirect('/datasheet')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let datasheet = req.datasheet
    datasheet.title = req.body.title
    datasheet.author = req.body.author
    datasheet.description = req.body.description
    datasheet.markdown = req.body.markdown
    try {
      datasheet = await datasheet.save()
      res.redirect(`/datasheet/${datasheet.slug}`)
    } catch (e) {
      res.render(`datasheet/${path}`, { datasheet: datasheet })
    }
  }
}

module.exports = router