require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// Load env var
dotenv.config({ path: './config/.env' });

//Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

//Enable CORS
app.use(cors());

// Mount routes
require('./startup/routes')(app);

// Connect to DB
require('./startup/db')();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`.yellow);
});

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});
