const { Router } = require('express')
const router = Router()
const {
   addPost,
   editPost,
   deletePost,
   getComments,
   deleteComment
} = require('../../controllers/api.controllers/api.admin.controller')


router.post('/add/post', addPost)
router.post('/edit/post/:id', editPost)
router.delete('/delete/post/:id', deletePost)
router.get('/comments', getComments)
router.delete('/delete/comment/:id', deleteComment)

module.exports = router
