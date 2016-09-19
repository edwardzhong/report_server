// var addon = require('bindings');
var key = "C602924B0D1090D931E3771D74ABBF9733A8C3545CFE1810";
var logger =require('../log').logger;
var erpvalidate = require("./erpvalidate");

/**
 * 从erp1.jd.com cookie解密出用户名
 * @param cbk 回调方法
 * @param erpname erp1.jd.com cookie
 */
exports.getUser = function(req, res, next){

    var erpname = req.cookies["sso.jd.com"];
    if(req.hostname.indexOf("jd.com") < 0)erpname = "zhongjianfeng3";

    //如果没有erp name，跳到登陆页面
    if(!erpname && req.hostname.indexOf("jd.com") >= 0){
        res.redirect("http://ssa.jd.com/sso/login?ReturnUrl=" + encodeURIComponent(req.protocol + "://" + req.hostname + req.originalUrl));
        return;
    }

    //dev机器，调用c++接口解密用户名
    if(req.hostname.indexOf("jd.com") >= 0){
        logger.info("start test login:"+erpname);
        erpvalidate.erpValidate({ticket:erpname,url:"http://report.jd.com",ip:getClientIp(req)},function(json){
            if(json.retcode!=0){
                logger.info("no login,"+json.retcode+",msg:"+json.msg);
                res.redirect("http://ssa.jd.com/sso/login?returnUrl=" + req.protocol + "://" + req.hostname + "/");
                return;
            }
            logger.info("is login");
            req.session.username = json.data.username;
            //管理员角色
            req.session.userrole = 2;
            res.locals.username = req.session.username;
            res.locals.userrole = req.session.userrole;
            next();
        });

    } else { //本机测试
        req.session.username = erpname;
        //管理员角色
        req.session.userrole = 2;
        res.locals.username = req.session.username;
        res.locals.userrole = req.session.userrole;
        next();
    }
};

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

