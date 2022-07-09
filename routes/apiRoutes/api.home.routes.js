const { Router } = require('express')
const {
   getAllBlogs,
   getOneBlog,
   sendComment
} = require('../../controllers/api.controllers/api.home.controller')

const router = Router()

router.get('/posts', getAllBlogs)
router.get('/post/:slug', getOneBlog)
router.post('/comment/:id', sendComment)

module.exports = router