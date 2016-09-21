package controllers

import (
	"github.com/astaxie/beego"
)

type Test5Controller struct {
	beego.Controller
}

func (c *Test5Controller) Getgo() {
	c.Ctx.Output.Body([]byte("v1/test5/getgo"))

}

func (c *Test5Controller) Getphp() {
	c.Ctx.Output.Body([]byte("v1/test5/getphp"))

}

func (c *Test5Controller) Getroom() {
	c.Ctx.Output.Body([]byte("v1/room/getroom"))

}
