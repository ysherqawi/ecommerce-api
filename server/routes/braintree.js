const express = require('express');
const router = express.Router();

const { generateToken, processPayment } = require('../controllers/braintree');

const { protect } = require('../middleware/auth');

router.route('/gettoken').get(protect, generateToken);
router.route('/payment').post(protect, processPayment);

module.exports = router;
