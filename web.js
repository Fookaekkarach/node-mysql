const express = require('express');
const web = express();
const indexRouter = require('./api/routes/index');
const userRouter = require('./api/routes/user');
const loginRouter = require('./api/routes/login');
const uploadRouter = require('./api/routes/upload');
const postRouter = require('./api/routes/post');
const followRouter = require('./api/routes/follow');
const bodyparser = require('body-parser');


web.use(bodyparser.json());
web.use('/image',express.static(__dirname + '/image'));
web.use('/image_post',express.static(__dirname + '/image_post'));
web.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, authorization ");
    next();
  });

web.use('/',indexRouter);
web.use('/user',userRouter);
web.use('/login',loginRouter);
web.use('/upload',uploadRouter);
web.use('/post',postRouter);
web.use('/follow',followRouter);

module.exports = web;