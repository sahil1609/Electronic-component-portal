const express = require('express')
const Component = require('../models/component')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('component/new', { component: new Component() })
})

router.get('/edit/:id', async (req, res) => {
  const component = await Component.findById(req.params.id)
  res.render('component/edit', { component: component })
})

router.get('/:slug', async (req, res) => {
  const component = await Component.findOne({ slug: req.params.slug })
  if (component == null) res.redirect('/')
  res.render('component/show', { component: component })
})

router.post('/', async (req, res, next) => {
  req.component = new Component()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.component = await Component.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Component.findByIdAndDelete(req.params.id)
  res.redirect('/component')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let component = req.component
    component.title = req.body.title
    component.author = req.body.author
    component.description = req.body.description
    component.markdown = req.body.markdown
    try {
      component = await component.save()
      res.redirect(`/component/${component.slug}`)
    } catch (e) {
      res.render(`component/${path}`, { component: component })
    }
  }
}

module.exports = router