var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
require('./components/user/Model')
require('./components/category/Model')
require('./components/brand/Model')
require('./components/product/Model')
require('./components/cart/Model')
require('./components/order/Model')
var indexRouter = require('./routes/index');
const userCpanelRouter = require('./routes/cpanel/user')
const productCpanelRouter = require('./routes/cpanel/product')
const userAPIRouter = require('./routes/api/user')
const productAPIRouter = require('./routes/api/product')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// tạo kết nối tới database
mongoose.connect('mongodb://127.0.0.1:27017/ShoeDB?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false', {
})
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));

app.use('/', indexRouter);
//http:localhost:3000/cpanel/users
app.use('/cpanel/users', userCpanelRouter);
// http://localhost:3000/cpanel/products
app.use('/cpanel/products', productCpanelRouter);
// http://localhost:3000/api/users
app.use('/api/users', userAPIRouter);
// http://localhost:3000/api/products
app.use('/api/products', productAPIRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
