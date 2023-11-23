const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// express app initialization
const app = express();

// import another file
const authRoute = require('./routes/authRoute');
// middlewares
app.use(cors());
app.use(express.json());

let uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcblope.mongodb.net/nodeAuth?retryWrites=true&w=majority`

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
    // Now you can perform operations like insertOne, find, etc.
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// use external routes
app.use('/auth', authRoute);

// if path not match this middleware will catch the error
app.use((req, res, next) => {
    next('requested url is not found');
  })

 // my custom error handler (middleware)
 const errorHandler = ((err, req, res, next) => {
    if(res.headersSent){
      return next(err)
    }
    res.send({error: err})
  })
app.use(errorHandler);


   // listening on port 5000
app.listen(5000, () => {
  console.log(`Example app listening on port 5000`)
})