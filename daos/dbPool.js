﻿/**
 * 数据库连接池工具类
 */
var mysql = require('mysql');
var dbconfig = require('../config/db');
var logger =require('../log').logger;
var pool = null;

/**
 * 获取数据库连接
 * @param cbk
 */
exports.getConnection = function(cbk){
    if(!pool){
        logger.info("创建数据库连接池");
        pool = mysql.createPool(dbconfig._db);
    }

    pool.getConnection(function(err, connection){
        //获取数据库连接出错
        if(err||!connection){
            logger.error("获取数据库连接失败："+err.code);
            throw err;
        }
        cbk(connection);
    });
}

/**
 * 获取数据库连接池
 * @returns {*}
 */
exports.getPool = function(){
    if(!pool){
        logger.info("创建数据库连接池");
        pool = mysql.createPool(dbconfig._db);
    }

    return pool;
}
