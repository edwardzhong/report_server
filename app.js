var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var router = require('./router');
var swig=require('swig');
var app = express();
var fs = require('fs');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var requestLogger = require('morgan');
var log = require('./log');//log4js

// log.use(app);

//配置http请求日志
var logDirectory = __dirname + '/logs'
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = fs.createWriteStream(logDirectory + '/access.log', {flags: 'a'})
app.use(requestLogger('common', {stream: accessLogStream}));
//cookie
app.use(cookieParser());
//配置session
app.use(session({
    secret: 'report me',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 8640000000
    }
}));

//配置模版
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/repsys/public', express.static(path.join(__dirname, 'public')));
router(app);

module.exports = app;