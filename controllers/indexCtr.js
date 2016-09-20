/**
 * 首页(风险命中统计)控制器
 */
var Q = require('q');
var sceneDao=require('../daos/sceneDao');
var chenDuDao=require('../daos/chenduDao');
var nameDao=require('../daos/nameDao');
var logger =require('../log').logger;

/**
 * 风险命中统计
 */
exports.getSceneData=function(req,res){
	var form=req.query,
		startTime=form.startTime.replace(/-/g,''),
		endTime=form.endTime.replace(/-/g,''),
		scene=form.scene||'',
		mData,cData;
	if(!startTime||!endTime){
		logger.info('param is null or empty');
		res.json({isSucc:false,msg:'param is null or empty',data:[],sumData:[],fields:[]});
		return;
	}
	startTime=parseInt(startTime,10);
	endTime=parseInt(endTime,10);
	if(!startTime||!endTime){
		logger.info('param type is wrong');
		res.json({isSucc:false,msg:'param type is wrong',data:[],sumData:[]});
		return;
	}
	Q.all([sceneDao.queryScene(startTime,endTime,scene),chenDuDao.queryChendu(startTime,endTime),nameDao.query()]).spread(function(sceneDatas,chenDuDatas,fields){
		var mData=getMergeData(sceneDatas,chenDuDatas,scene);
		res.json({isSucc:true,msg:'succ',data:mData,sumData:chenDuDatas,fields:fields});
	})
	.fail(function(err){
		logger.error('查找风险命中统计错误：');
		logger.error(err);
		res.json({isSucc:false,msg:String(err),data:[],sumData:[],fields:[]});
	});
}

/**
 * 查找当天24小时数据
 */
exports.querySceneByDay=function(req,res){
	var form=req.query,
		day=form.day.replace(/-/g,''),
		scene=form.scene||'';
	if(!day){
		logger.info('param is null or empty');
		res.json({isSucc:false,msg:'param is null or empty',data:[],fields:[]});
		return;
	}
	day=parseInt(day,10);
	if(!day){
		logger.info('param type is wrong');
		res.json({isSucc:false,msg:'param type is wrong',data:[],fields:[]});
		return;
	}
	Q.all([sceneDao.queryScene(day,day,scene),chenDuDao.queryChendu(day,day),nameDao.query()]).spread(function(sceneDatas,chenDuDatas,fields){
		var mData=getMergeData(sceneDatas,chenDuDatas,scene);
		res.json({isSucc:true,msg:'succ',data:mData,fields:[]});
	})
	.fail(function(err){
		logger.error('按天查找风险命中统计错误：');
		logger.error(err);
		res.json({isSucc:false,msg:String(err),data:[],fields:[]});
	});
};

function getMergeData(sceneDatas,chenDuDatas,scene){
	var mData=mergeItemByTime(sceneDatas,scene);
	mData.forEach(function(item,i){
		if(!scene) {//所有场景
			cData=chenDuDatas.filter(function(cItem,j){return cItem.dan_time==item.dan_time; });
			if(cData.length){
				for(var prop in cData[0]){
					item[prop]=cData[0][prop];
				}
			}
		}
		item.dan_hit_percent=Math.round((item.dan_check_H_total/item.dan_check_total)*10000)/100;
		item.dan_user_percent=Math.round((item.dan_user_H_total/item.dan_user_total)*10000)/100;
		item.bc_percent=Math.round(item.dan_hit_me_H_user/item.dan_user_H_total*10000)/100;
	});
	return mData;
}

/**
 * 合并数据
 */
function mergeItemByTime(data,isAll){
	var mergeObj={},
		ret=[],
		firstItem={};
	data.forEach(function(item,i){
		//合并相同日期的项
		mergeObj[''+item.dan_time]=mergeObj[''+item.dan_time]||[];
		mergeObj[''+item.dan_time].push(item);
	});
	for(var v in mergeObj){
		mergeObj[v].forEach(function(item,i){
			if(item.dan_hit_rid){
				item.dan_hit_rid=item.dan_hit_rid.split('|');
			} else {
				item.dan_hit_rid=[];
			}
			if(i==0){
				firstItem=item;
				if(!isAll){firstItem.scene_id=''; }
			} else {
				firstItem.dan_check_total+=item.dan_check_total;
				firstItem.dan_user_total+=item.dan_user_total;
				firstItem.dan_hit_rid=firstItem.dan_hit_rid.concat(item.dan_hit_rid);
			}
		});
		ret.push(firstItem);
	}
	return ret;
}