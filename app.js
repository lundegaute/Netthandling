var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var productRouter = require("./routes/products");
var cartRouter = require("./routes/cart");
var orderRouter = require("./routes/orders");
var orderStatusesRouter = require("./routes/orderStatuses");
var brandRouter = require("./routes/brands");
var membershipRouter = require("./routes/memberships");
var categoryRouter = require("./routes/categories");
var initRouter = require("./routes/init");
var searchRouter = require("./routes/search");
var adminRouter = require("./routes/admin");
var roleRouter = require("./routes/roles");


require("dotenv").config();
var db = require("./models");
db.sequelize.sync({ force: false });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/orderStatuses', orderStatusesRouter);
app.use('/brands', brandRouter);
app.use('/memberships', membershipRouter);
app.use('/categories', categoryRouter);
app.use('/init', initRouter);
app.use('/search', searchRouter);
app.use('/admin', adminRouter);
app.use('/roles', roleRouter);

app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

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
