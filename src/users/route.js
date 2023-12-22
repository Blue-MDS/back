const express = require('express');
const { createUser, login, updateUser, deleteUser } = require('./controller');
const { checkToken } = require('../middlewares/authentication');
const router = express.Router();

router.post('/subscribe', createUser);
router.post('/login', login);
router.put('/update', checkToken, updateUser);
router.delete('/delete', checkToken, deleteUser);

module.exports = router;
