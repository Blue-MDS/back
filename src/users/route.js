const express = require('express');
const upload = require('../../multer.config');
const { 
  createUser, 
  login, 
  updateUser, 
  deleteUser, 
  completeProfile, 
  checkProfileComplete, 
  getUser,
  updateUserProfilePicture,
} = require('./controller');
const { checkToken } = require('../middlewares/authentication');
const router = express.Router();

router.post('/subscribe', createUser);
router.post('/login', login);
router.get('/', checkToken, getUser);
router.put('/update', checkToken, updateUser);
router.get('/completeProfile', checkToken, completeProfile);
router.delete('/delete', checkToken, deleteUser);
router.get('/checkProfileComplete', checkToken, checkProfileComplete);
router.post('/updateProfilePicture', checkToken, upload.single('avatar'), updateUserProfilePicture);
router.post('/selectPredefinedAvatar', checkToken, updateUserProfilePicture);

module.exports = router;
