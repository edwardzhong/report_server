/**
 * 规则定义数据访问
 */
var pool = require("./dbPool").getPool();
var Q = require('q');
var logger =require('../log').logger;

exports.query=function(){
	return Q.Promise(function(resolve, reject, notify) {
        var sql = "select * from danger_with_name";
        logger.info('查找规则定义：');
        logger.info(sql);
        pool.query(sql, [], function(err, result){
            if(err){
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};