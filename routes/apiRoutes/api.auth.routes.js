const router = require('express').Router()
const { login } = require('../../controllers/api.controllers/api.auth.controller')

router.post('/login', login)

module.exports = router
