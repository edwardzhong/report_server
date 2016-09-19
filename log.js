var log4js = require('log4js');
var path = require('path');

log4js.configure(path.join("config/log4js.json"));

var dateFileLog = log4js.getLogger('dateFileLog');

exports.logger = dateFileLog;

exports.use = function(app) {
    app.use(log4js.connectLogger(dateFileLog, {level:'debug', format:':method :url'}));
};