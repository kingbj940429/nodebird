const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');//휘발성임
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
require('dotenv').config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter= require('./routes/post');
const userRouter = require('./routes/user');


const {sequelize} = require('./models');//디비와 서버 연결 require('./models')에서 index.js은 생략가능하다. 즉 './models' == './models/index.js'
//var sequelize = require('./models/index').sequelize; 이것도 가능
const passprotConfig = require('./passport');
const logger = require('./logger');

const app = express();
sequelize.sync();//시퀄라이즈 실행
passprotConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

if(process.env.NODE_ENV == 'production'){
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
}else{
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave : false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie : {
    httpOnly: true,
    secure: false,
  },
};
if(process.env.NODE_ENV === 'production'){
  sessionOption.proxy = true;
}
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth',authRouter);
app.use('/post',postRouter);
app.use('/user',userRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  logger.info('hello');
  logger.error(err.message);
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
