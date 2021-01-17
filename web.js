const express = require('express');
const web = express();
const indexRouter = require('./api/routes/index');
const userRouter = require('./api/routes/user');
const loginRouter = require('./api/routes/login');
const bodyparser = require('body-parser');


web.use(bodyparser.json());

web.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });

web.use('/',indexRouter);
web.use('/user',userRouter);
web.use('/login',loginRouter);

module.exports = web;