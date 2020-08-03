const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword,
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/updatedetails').put(protect, updateDetails);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/logout').get(protect, logout);

module.exports = router;
