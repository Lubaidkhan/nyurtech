const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = express();
var indexRouter = require('./routes/index.router');

// set the view engine to ejs
app.set('view engine', 'ejs');
const notFound = require('./errors/notFound');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Initialized DB
require('./initDB')();
  
app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,post, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/uploads', express.static(__dirname + '/uploads'));


app.get('/', (req, res) => {
  res.send('Api is working...');
});

app.use('/', indexRouter);


app.use(notFound)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});

app.use((err, req, res, next) => {
  if(err.isOperational){
    return res.status(err.statusCode || 500).send({ message: err.name, isOperational: err.isOperational })
    
  }
  else{
    return res.status(err.statusCode || 500).send({ message: err.message, status: err.status, validCheck: err.validCheck })

  }
})

