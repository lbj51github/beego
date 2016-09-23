package routers


import (
	"beego/controllers/user"

	"github.com/astaxie/beego"

	"github.com/astaxie/beego/context"

)

func init() {
	//初始化namespace
	ns := beego.NewNamespace("/user",
		// 条件判断，如果为真，则可以匹配上下文的路由，如果为假，则上下文的路由都不能匹配
		beego.NSCond(func(ctx *context.Context) bool {
			if ctx.Input.Domain() == "127.0.0.1" {
				return true
			}
			return false
		}),
		beego.NSNamespace("/user",
			beego.NSCond(func(ctx *context.Context) bool {
					return true
			}),
			beego.NSRouter("/login", &user.UserController{}, "get:Login"),
		),

	)
	//注册namespace
	beego.AddNamespace(ns)

}
