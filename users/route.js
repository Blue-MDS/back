const express = require('express')
const { createUser, login } = require('./controller')
const router = express.Router();

router.post('/subscribe', createUser)
router.post('/login', login)

module.exports = router
