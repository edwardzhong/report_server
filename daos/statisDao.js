/**
 * 风险打标统计数据访问
 */
var pool = require("./dbPool").getPool();
var Q = require('q');
var logger =require('../log').logger;

exports.queryStatis=function(start,end){
	return Q.Promise(function(resolve, reject, notify) {
		var sql="select *,UNIX_TIMESTAMP(create_time)time_stamp from t_danger_hit_rid_statis where r1_int=1 and statis_type=0 and create_time>=? and create_time<=? ORDER by create_time DESC";
        logger.info('风险打标统计：');
        logger.info(sql+' param:'+start+','+end);
		pool.query(sql, [start,end], function(err, result){
            if(err){
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};