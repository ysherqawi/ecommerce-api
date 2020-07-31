const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

const app = express();

// Load env var
dotenv.config({ path: './config/.env' });

// Mount routes
require('./startup/routes')(app);

// Connect to DB
require('./startup/db')();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`.yellow);
});
