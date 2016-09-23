package user

import (
	"github.com/astaxie/beego"
)

type UserController struct {
	beego.Controller
}

func (c *UserController) Login() {
	//c.Ctx.Output.Body([]byte("Login"))
	c.TplName = "user/login.tpl"
}



