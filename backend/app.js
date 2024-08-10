const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');


console.log()

const app = express();
app.use(cors());


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


app.get('/hello', (req, res) => {
    res.send('Hello, world!');
});


connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server started on port ' + process.env.PORT);
    });
})
.catch((err) => {
    console.error(err.message);
    process.exit(1);
});
