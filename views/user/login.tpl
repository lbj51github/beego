<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1" />
<meta http-equiv="X-UA-Compatible" content="IE=9">
<link rel="stylesheet" type="text/css" href="/static/admtools/v1.0/css/main.css">
<script type="text/javascript" src="/static/admtools/v1.0/js/jquery.min.js"></script>
<script type="text/javascript">var STATIC_AMDTOOLS_URL = "/static/admtools";var STATIC_ADMTOOLS_VERSION_URL = "/static/admtools/v1.0";var UPLOAD_URL = "/uploads/";var SITE_URL = "http://dev.admtools.okbsc.com";</script><script type="text/javascript" src="/static/admtools/v1.0/js/admintools.js"></script>
<script type="text/javascript">
//处理当前是否有子页面
var topWinowLevel = 1;
var topWin= (function (p,c){
    while(p!=c){
        c = p;
        p = p.parent;
        ++topWinowLevel;
    }
    return c;
})(window.parent,window);

if(window.topWinowLevel>1){
    parent.window.location.href='/logout';
}
</script>
<title>登录</title>
<style>
  body{ background:#323b40 url(/static/admtools/v1.0/images/loginbg.png); text-shadow:0 0 2px rgba(255,255,255,0.2); color:#fff;}
  .logintit{ padding:60px 0 40px 30px;}
  h1{ font-size:36px;}
  .login{ background-color:rgba(0,0,0,0.3); width:506px; margin-left:30px; padding:15px 20px;box-shadow:0 0 1px 0 rgba(255,255,255,0.2); }
.login  .intxt{ height:32px; line-height:32px; padding:0 10px; width:100%; box-sizing:border-box; border:0; background-color:rgba(0,0,0,0.4); border-radius:2px;box-shadow:0 0 1px 0 rgba(255,255,255,0.2); color:#ccc;}
.login  .tr{ margin-bottom:12px;}
.login h2{ font-size:26px; padding-bottom:12px;}
.loginBtn{ border:0; height:32px; padding:0 20px; background: -webkit-linear-gradient(top, rgba(38,38,38,0.9), rgba(0,0,0,0.9)); color:#fff; box-shadow:0 0 1px 0 rgba(255,255,255,0.1);
background: -ms-linear-gradient(top, rgba(38,38,38,0.9), rgba(0,0,0,0.9)); color:#fff; box-shadow:0 0 1px 0 rgba(255,255,255,0.1);
background:-moz-linear-gradient(top, rgba(38,38,38,0.9), rgba(0,0,0,0.9)); color:#fff; box-shadow:0 0 1px 0 rgba(255,255,255,0.1);
background:-o-linear-gradient(top, rgba(38,38,38,0.9), rgba(0,0,0,0.9)); color:#fff; box-shadow:0 0 1px 0 rgba(255,255,255,0.1);
background: linear-gradient(top, rgba(38,38,38,0.9), rgba(0,0,0,0.9)); color:#fff; box-shadow:0 0 1px 0 rgba(255,255,255,0.1); background-color:rgba(0,0,0,0.9);}

</style>
</head>
<body>
<div class="logintit">
<h1>网站后台管理系统</h1>
<p style="font-size:14px">Shenzhen cloud mediator technology co., LTD. Web site background management system</p>
</div>
<div class="login box">
  <h2>管理员登录</h2>
  <div class="tr">
    <div class="td12"><input id="username" type="text" placeholder="输入用户名" class="intxt"></div>
  </div>
  <div class="tr">
    <div class="td12"><input id="password" type="password" placeholder="输入密码" class="intxt"></div>
  </div>
  <div class="tr">
    <div class="td5"><input id="captcha" type="text" placeholder="输入验证码" class="intxt"></div>
    <div class="left" id="captcha_area"></div>
  </div>
  <div class="tr">
     <div class="td12"><label><input class="vlm" type="checkbox"> <b class="vlm">记住账户</b></label></div>
  </div>
  <div class="tr">
    <div class="td12">
      <input type="button" id="login_btn" value="登录" class="loginBtn">
    </div>
  </div>
</div>
</body>

<script type="text/javascript">
    var admtools = new AdminTools();
    $(function(){
        admtools.login_init();
    });
</script>

</html>
