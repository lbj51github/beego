package controllers

import (
	"github.com/astaxie/beego"
)

type Test2Controller struct {
	beego.Controller
}

func (c *Test2Controller) Get() {
	var str = c.Ctx.Input.Param(":all")
	c.Ctx.Output.Body([]byte(str))
}
