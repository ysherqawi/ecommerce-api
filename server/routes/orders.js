const express = require('express');
const router = express.Router();

const { createOrder } = require('../controllers/orders');

const { protect } = require('../middleware/auth');

const {
  addOrderToUserHistory,
} = require('../middleware/addOrderToUserHistory');

router.route('/create').post(protect, addOrderToUserHistory, createOrder);

module.exports = router;
