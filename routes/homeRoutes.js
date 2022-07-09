const { Router } = require('express') 
const router = Router()
const {
    getLimitBlog,
    getAllBlog,
    getBlog,
    sendComment
} = require('../controllers/homeController')

router.get('/', getLimitBlog)
router.get('/blogs', getAllBlog)
router.get('/blogpost', getBlog)
router.post('/comment/:id', sendComment)

module.exports = router
