require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const apiRouter = require('./routes/api/index');
const authRouter = require('./routes/admin/authRouter');
const dashboardRouter = require('./routes/admin/dashboardRouter');
const categoryRouter = require('./routes/admin/categoryRouter');
const nominalRouter = require('./routes/admin/nominalRouter');
const voucherRouter = require('./routes/admin/voucherRouter');
const bankRouter = require('./routes/admin/bankRouter');
const paymentRouter = require('./routes/admin/paymentRouter');
const transactionRouter = require('./routes/admin/transactionRouter');

const config = require('./config');
const { authenticate } = require('./app/middleware/authMiddleware');
const { mongoDbUrl } = require('./config');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session
app.use(session({
  store: MongoStore.create({
    mongoUrl: mongoDbUrl
  }),
  secret: config.secretKey,
  resave: true,
  saveUninitialized: true
}));

// cookie parser
app.use(cookieParser());

// use connect-flash
app.use(flash());

// add CORS for specific domain

app.use(logger('dev'));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRouter);
app.use('/dashboard', authenticate, dashboardRouter);
app.use('/category', authenticate, categoryRouter);
app.use('/nominal', authenticate, nominalRouter);
app.use('/voucher', authenticate, voucherRouter);
app.use('/bank', authenticate, bankRouter);
app.use('/payment', authenticate, paymentRouter);
app.use('/transaction', authenticate, transactionRouter);

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.render('errors/404', { title: "404 not found" });
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
