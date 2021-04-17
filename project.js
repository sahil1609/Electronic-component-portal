const express = require('express')
const Project = require('../models/project')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('project/new', { project: new Project() })
})

router.get('/edit/:id', async (req, res) => {
  const project = await Project.findById(req.params.id)
  res.render('project/edit', { project: project })
})

router.get('/:slug', async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug })
  if (project == null) res.redirect('/')
  res.render('project/show', { project: project })
})

router.post('/', async (req, res, next) => {
  req.project = new Project()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.project = await Project.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Project.findByIdAndDelete(req.params.id)
  res.redirect('/project')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let project = req.project
    project.title = req.body.title
    project.author = req.body.author
    project.description = req.body.description
    project.markdown = req.body.markdown
    try {
      project = await project.save()
      res.redirect(`/project/${project.slug}`)
    } catch (e) {
      res.render(`project/${path}`, { project: project })
    }
  }
}

module.exports = router