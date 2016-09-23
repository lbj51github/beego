/**
 * 字符去空格
 */
String.prototype.trim=function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 转换json字符串为json对象
 *
 * @return json-object
 */
String.prototype.revert_json = function(){
    if(this=='' || this.substr(0,1)!='{' || this.substr(this.length-1)!='}')
    {
        return false;
    }
    else
    {
        return eval('('+this+')');
    }
}

/**
 * 后台登录类
 */
function AdminLogin(params) {
	
}

/**
 * 属性配置表
 *
 * 所有相关的url都需要在这里配置
 */


AdminLogin.prototype = {

	/**
	 * debug 模式
	 */
	debug : false,

    /**
     * 登录ajax接口
     */
    url_login : '/login/ajax_login',

    /**
     * 验证登录
     */
    url_is_login : '/login/ajax_is_login',

    /**
     * 退出登录
     */
    url_logout : '/login/ajax_logout',

    /**
     * 验证码
     */
    url_captcha : '/login/ajax_captcha',

	/**
	 * 初始化
	 */
	init: function() {
		var _self = this;
		//刷新验证码
		this.refresh_captcha();
		//绑定验证
		$('#login_btn').click(function(){
			_self.login();
		});
	},

	/**
	 * 刷新验证码
	 */
	refresh_captcha: function() {
		var h = $('#captcha_area').html();
		if(h.trim()==''){
			var html = '<img id="captcha_img" src="'+this.url_captcha+'" >';
			$('#captcha_area').html(html);

			var _self = this;
			$("#captcha_img").click(function(){
				_self.refresh_captcha();
			});
		}
		//如果验证
		else
		{
			var src = this.url_captcha + '?rnd=' + Math.random();
			$('#captcha_img').attr('src', src);
		}
	},

	/**
	 * 登录函数
	 */
	login: function() {
		var un = $('#username').val().trim();
		var pw = $('#password').val().trim();
		var cp = $('#captcha').val().trim();
		
		if(un=='' || pw==''){
			alert('用户名或密码不能为空!');
			return;
		}
		if(cp==''){
			alert('验证码不能为空!');
			return;
		}

		var _self = this;
		$.post(this.url_login, {'username':un, 'password':pw, 'captcha':cp, 'login':1, 'is_ajax':1}, 
			function(data){
				var d = data.revert_json();
				//登录成功
				if(d.return_code==1){
					window.location.href = '/home'
				}
				else
				{
					//提示错误
					alert(d.msg);
					//重新刷验证码
					_self.refresh_captcha();
				}
			}
		)
	},

	/**
	 * 注销函数
	 */
	logout: function() {
		var _self = this;
		$.post(this.url_logout, {'is_ajax':1}, 
			function(data){
				var d = data.revert_json();
				//注销成功
				if(d.return_code==1){
					window.location.href = '/logout'
				}
				else
				{
					//提示错误
					alert('注销异常!');
				}
			}
		)
	},

}