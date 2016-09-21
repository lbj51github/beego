package controllers

import (
	"github.com/astaxie/beego"
)

type TestController struct {
	beego.Controller
}

func (c *TestController) Get() {
	c.Ctx.Output.Body([]byte("get test"))
}

func (c *TestController) Post() {
	c.Ctx.Output.Body([]byte("post test"))
}
