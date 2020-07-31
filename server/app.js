const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');

const app = express();

dotenv.config({ path: './config/.env' });

app.get('/', (req, res) => res.send('Hello World!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`.green.underline);
});
