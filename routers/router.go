package routers

import (
	"beego/controllers"

	"github.com/astaxie/beego"

	"github.com/astaxie/beego/context"
)

func init() {

	//基础路由  method | post get
	beego.Router("/test", &controllers.TestController{})
	//http://localhost:8080/test  分别用get 或 post方式

	//参数路由  *.* || * | ([\w]+) | :id | :id! | :id([0-9]+).html
	beego.Router("/test2/:all([0-9]+)", &controllers.Test2Controller{})
	//http://localhost:8080/test2/999

	//映射路由 restfull  注意第三个参数 get:Add get,post:Add  get:Add;post:edit
	beego.Router("/test3/add/:id([0-9]+)", &controllers.Test3Controller{}, "*:Add")
	//http://localhost:8080/test3/add/88

	//自动化路由  url 不区分大小写
	beego.AutoRouter(&controllers.Test4Controller{})
	//http://localhost:8080/test4/save/qqq  test4控制器下面的save方法 后面为参数
	//http://localhost:8080/test4/save.html  :ext 获取后缀

	//namespace路由
	//初始化namespace
	ns := beego.NewNamespace("/v1",
		//http://localhost:8080/v1/test5/getgo
		beego.NSRouter("/test5/getgo", &controllers.Test5Controller{}, "get:Getgo"),
		// 条件判断，如果为真，则可以匹配上下文的路由，如果为假，则上下文的路由都不能匹配
		/*beego.NSCond(func(ctx *context.Context) bool {
			if ctx.Input.Domain() == "127.0.0.1" {
				return true
			}
			return false
		}),
		*/
		beego.NSRouter("/test5/getphp", &controllers.Test5Controller{}, "get:Getphp"),

		// nasespace嵌套示例
		//http://localhost:8080/v1/room/getroom
		beego.NSNamespace("/room",
			beego.NSCond(func(ctx *context.Context) bool {
				// 如果子namespace的判断条件为假，那么仅仅是子namespace的url不能匹配，不影响夫namespace的匹配结果
				if ctx.Input.Method() == "GET" {
					return true
				}
				return false
			}),
			beego.NSRouter("/getroom", &controllers.Test5Controller{}, "*:Getroom"),
		),
	)
	//注册namespace
	beego.AddNamespace(ns)

	beego.Router("/", &controllers.MainController{})

}
