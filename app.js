const mongoose=require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nocache=require('nocache')
require('dotenv').config();

 
const userRouter=require('./routes/userRouter')
const adminRouter=require('./routes/adminRouter')

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


const port = process.env.PORT || '7000'
app.set('port', port);
app.listen(port,()=>{
  console.log(`Server is running...on http://localhost:${port}`)
});



module.exports = app;

