const { Router } = require('express')
const {
    getHomeAdminPanel,
    getAddPage,
    getAddPost,
    getEditPage,
    getEditPost,
    deletePost,
    getComments,
    deleteComments
} = require('../controllers/adminController')
const { protected } = require('../middlewares/auth')

const router = Router()

router.get('/home', protected, getHomeAdminPanel)
router.get('/add', protected, getAddPage)
router.post('/add', protected, getAddPost)
router.get('/edit', protected, getEditPage)
router.post('/delete/:id', protected, deletePost)
router.post('/edit/:slugUrl', protected, getEditPost)
router.get('/comments/', getComments)
router.post('/comment/delete/:id', deleteComments)

module.exports = router
