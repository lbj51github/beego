# beego
go基础项目之边学边写


1.参考http://beego.me/docs/quickstart/new.md ,创建web项目

2.路由设置 查看routers/router.go（每条下面有对应的测试url） 路由设置对应几个test的go文件测试

3.导入后台管理模板，user(routers/user.go)模块路由和user目录控制器（controller/user/user.go）部署
    注意点：user路由里面  import "beego/controllers/user"
            user控制器   package user
