/**
 * 风险命中统计数据访问层
 */
var pool = require("./dbPool").getPool();
var Q = require('q');
var util = require('util');
var logger =require('../log').logger;

exports.queryScene=function(start,end,scene){
    return Q.Promise(function(resolve, reject, notify) {
    	var param=[start,end];
    	if(scene){param.push(scene);}
        var sql = util.format("select * from danger_with_scene where dan_time>=? and dan_time<=? %s ORDER by dan_time DESC",scene?'and scene_id=?':'');
        logger.info('查找风险命中统计：');
        logger.info(sql+' param:'+param.join(','));
        pool.query(sql, param, function(err, result){
            if(err){
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.querySceneByDay=function(day){
    return Q.Promise(function(resolve,reject,notify){
        var sql="select * from danger_with_scene where CAST(dan_time AS char(10)) REGEXP  '?[[:digit:]]+'";
        logger.info('按天查找风险命中统计：');
        logger.info(sql+' param:'+day);
        pool.query(sql, day, function(err, result){
            if(err){
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}