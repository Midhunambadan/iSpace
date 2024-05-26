// const mongoose=require('mongoose')
// mongoose.connect('mongodb://127.0.0.1:27017/iSpace')

require('dotenv').config();

// Now you can access the MongoDB URI from the environment variable
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const PDFDocument = require('pdfkit');


const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer=require('multer')
const nocache=require('nocache')
require('dotenv').config();
const sharp = require('sharp');


// mongoose.connect(process.env.MONGODBURL)
// .then((e)=>console.log('Mongo connected sucessfully'));



const userRouter=require('./routes/userRouter')
const adminRouter=require('./routes/adminRouter')
// const categoryRouter=require('./routes/categoryRouter')

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(nocache()) 

app.use('/',userRouter)

app.use('/admin',adminRouter)


// app.use('*',(req,res)=>{
//   res.render('error')
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
