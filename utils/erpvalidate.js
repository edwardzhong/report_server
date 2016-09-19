/**
   SSA验证�?
   param opt ={ticket:,url,ip}
*/
var request = require('request');
var logger =require('../log').logger;
exports.erpValidate = function(opt,cbk){
    if(!cbk){
        cbk = function(){};
    }
    var result={retcode:1};
    if(!opt){
        result.msg="param error";
        cbk(result);
        return;
    }
    if(!opt.ticket){
        result.msg="ticket empty";
        cbk(result);
        return;
    }
    if(!opt.url){
        result.msg="url empty";
        cbk(result);
        return;
    }
    if(!opt.ip){
        result.msg="ip empty";
        cbk(result);
        return;
    }
    var url = 'http://ssa.jd.com/sso/ticket/verifyTicket?ticket='+opt.ticket+"&ip="+opt.ip+"&url="+encodeURIComponent(opt.url);
    //logger.info("url:"+url);
    if(!request){
        result.msg="need request module";
        cbk(result);
        return;
    }

    request(url, function (error,res,body) {
        if(error){
            result.msg=error;
            cbk(result);
            return;
        }
        if (res && res.statusCode == 200) {
            try{
                var data = JSON.parse(body);
                if(data.REQ_FLAG){//ticketÓÐÐ§
                    result.retcode = 0;
                    result.data = data.REQ_DATA;
                }else{
                    result.retcode = data.REQ_CODE;
                    result.msg = data.REQ_MSG;
                }
            }catch(e){
                result.msg="jsonparse error";
            }
        }else{
            result.retcode=res?res.statusCode:"res is empty";
        }
        cbk(result);
    });
}

