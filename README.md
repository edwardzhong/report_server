1.基于express，模版引擎swig
2.数据库为mysql，使用node-mysql
3.启动文件 bin/start.js
4.部署在linux服务上使用 forever 监控
5.目录结构
	bin
	config 配置文件夹
	controllers 控制器文件
	daos 数据库访问层夹
	logs 日志文件夹
	public 静态文件夹
	utils 工具文件夹
	views 视图文件夹
	--app.js app
	--log.js log4js
	--router.js 路由器
	--startup.sh 启动脚本
	--stop.sh  停止脚本
	--tables.sql 数据表定义
