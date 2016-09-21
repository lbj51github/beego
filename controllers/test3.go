package controllers

import (
	"github.com/astaxie/beego"
)

type Test3Controller struct {
	beego.Controller
}

func (c *Test3Controller) Add() {
	var str = c.Ctx.Input.Param(":id")
	c.Ctx.Output.Body([]byte("test3/Add/" + str))
}
