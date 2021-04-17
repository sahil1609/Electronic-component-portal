const express = require('express')
const Video = require('./../models/video')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('video/new', { video: new Video() })
})

router.get('/edit/:id', async (req, res) => {
  const video = await Video.findById(req.params.id)
  res.render('video/edit', { video: video })
})

router.get('/:slug', async (req, res) => {
  const video = await Video.findOne({ slug: req.params.slug })
  if (video == null) res.redirect('/')
  res.render('video/show', { video: video })
})

router.post('/', async (req, res, next) => {
  req.video = new Video()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.video = await Video.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Video.findByIdAndDelete(req.params.id)
  res.redirect('/video')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let video = req.video
    video.title = req.body.title
    video.author = req.body.author
    video.description = req.body.description
    video.markdown = req.body.markdown
    try {
      video = await video.save()
      res.redirect(`/video/${video.slug}`)
    } catch (e) {
      res.render(`video/${path}`, { video: video })
    }
  }
}

module.exports = router