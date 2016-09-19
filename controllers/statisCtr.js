/**
 * 风险打标统计控制器
 */
var statisDao=require('../daos/statisDao');
var nameDao=require('../daos/nameDao');
var logger =require('../log').logger;
var Q = require('q');

/**
 * 风险打标统计
 */
exports.getStatisData=function(req,res){
	var form=req.query,
		startTime=form.startTime.replace(/-/g,''),
		endTime=form.endTime.replace(/-/g,'');
	if(!startTime||!endTime){
		res.json({isSucc:false,msg:'param is null or empty',data:[],fields:[]});
		return;
	}
	startTime=parseInt(startTime,10);
	endTime=parseInt(endTime,10);
	if(!startTime||!endTime){
		res.json({isSucc:false,msg:'param type is wrong',data:[],fields:[]});
		return;
	}
	Q.all([statisDao.queryStatis(startTime,endTime),nameDao.query()]).spread(function(data,fields){
		//按日期合并
		var mergeObj={},firstItem={},mergeData=[];
		data.forEach(function(item,i){
			mergeObj[''+item.time_stamp]=mergeObj[''+item.time_stamp]||[];
			mergeObj[''+item.time_stamp].push(item);
		});
		for(var v in mergeObj){
			mergeObj[v].forEach(function(item,i){
				if(i==0){firstItem=item; }
				firstItem['hit_times_'+item.risk_id]=item.hit_times;
				firstItem['hit_users_'+item.risk_id]=item.hit_users;
			});
			mergeData.push(firstItem);
		}
		res.json({isSucc:true,msg:'succ',data:mergeData,fields:fields});
	}).fail(function(err){
		logger.error('查找风险打标统计错误：');
		logger.error(err);
		res.json({isSucc:false,msg:String(err),data:[],fields:[]});
	});
};