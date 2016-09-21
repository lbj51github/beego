package controllers

import (
	"github.com/astaxie/beego"
)

type Test4Controller struct {
	beego.Controller
}

func (c *Test4Controller) Save() {
	var a = c.Ctx.Input.Param(":ext")
	c.Ctx.Output.Body([]byte(a))

	//var str = c.Ctx.Input.Params()
	//	for i, v := range str {
	//		c.Ctx.Output.Body([]byte(i + "==>" + v))
	//	}

}
