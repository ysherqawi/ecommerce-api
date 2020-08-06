const express = require('express');
const router = express.Router();

const { createOrder } = require('../controllers/orders');

const { protect } = require('../middleware/auth');

router.route('/create').post(protect, createOrder);

module.exports = router;
