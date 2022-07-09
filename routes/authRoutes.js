const { Router } = require('express')
const {
    getLogin,
    getRegister,
    getPostRegister,
    getPostLogin,
    getLogOut
} = require('../controllers/authController')
const { isAuth } = require('../middlewares/auth')

const router = Router()

router.get('/login', isAuth, getLogin)
router.get('/register', isAuth, getRegister)
router.post('/register', isAuth, getPostRegister)
router.post('/login', isAuth, getPostLogin)
router.get('/logout', getLogOut)

module.exports = router
