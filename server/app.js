require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const cookieParser = require('cookie-parser');

const app = express();

// Load env var
dotenv.config({ path: './config/.env' });

//Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Mount routes
require('./startup/routes')(app);

// Connect to DB
require('./startup/db')();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`.yellow);
});
