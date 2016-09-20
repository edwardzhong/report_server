/**
 * 成都表数据访问层
 */
var pool = require("./dbPool").getPool();
var Q = require('q');
var logger =require('../log').logger;

exports.queryChendu=function(start,end){
    return Q.Promise(function(resolve, reject, notify) {
        var sql = "select *,(ifnull(dan_hit_chendu_H,0)+ifnull(dan_hit_me_H,0)+ifnull(dan_hit_all_H,0)) as dan_check_H_total, (ifnull(dan_hit_chendu_H_user,0)+ifnull(dan_hit_me_H_user,0)+ifnull(dan_hit_all_H_user,0)) as dan_user_H_total from danger_compare_with_chendu where dan_time>=? and dan_time<=? ORDER by dan_time ASC"; 
        logger.info('查找数据汇总：');
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