var indexCtr=require('./controllers/indexCtr');
var statisCtr=require('./controllers/statisCtr');
var userInfo=require('./utils/userinfo');

module.exports=function(app){
	app.all("*",userInfo.getUser);
	app.get('/repsys/',index);
	app.get('/repsys/index',index);
	app.get('/repsys/statis',statis);
	app.get('/repsys/logout',logout);
	app.get('/repsys/getSceneData',indexCtr.getSceneData);
	app.get('/repsys/getStatisData',statisCtr.getStatisData);
	app.get('/repsys/getSceneDataByDay',indexCtr.querySceneByDay);
	// app.use(noExist);
};


//首页
function index(req,res){
	res.render('index');
}

//风险打标统计页面
function statis(req,res){
	res.render('statis');
}

//登出
function logout(req,res){
	req.session.username = null;
	res.redirect("http://ssa.jd.com/sso/login?ReturnUrl=" + encodeURIComponent(req.protocol + "://" + req.headers.host +'/repsys/'));
}

//404页面
function noExist(req,res){
	res.render('404');
}