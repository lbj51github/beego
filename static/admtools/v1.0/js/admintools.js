/**
 * author: kevin.qin 2016-07-15
 */

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
function AdminTools(params) {
	
}

/**
 * 属性配置表
 *
 * 所有相关的url都需要在这里配置
 */
AdminTools.prototype = {

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
    url_logout : '/logout',

    /**
     * 验证码
     */
    url_captcha : '/login/ajax_captcha',

    /**
	 *
	 */
	url_route_opt_url : '/tools/route_opt',

    /**
     * 得到当前用户
     */
    url_get_cur_user : '/tools/ajax_get_cur_user',

	/**
	 * 得到当前ID
	 */
	url_get_cur_menus : '/tools/ajax_get_app_menus',

	/**
	 * 菜单数据
	 */
	menus_data : {},

	/**
	 * 菜单tab数据
	 */
	menus_click_data : [],

	/**
	 * 当前用户数据
	 */
	user_data : null,

	/**
	 *
	 */
	cur_menu_id : 0,

	/**
	 * 是否未定义
	 */
	is_undef: function(d) {
		if(typeof(d)=='undefined'){
			return true;
		}
		return false;
	},

	/**
	 * 初始化
	 */
	login_init: function() {
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
					window.location.href = '/'
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
					window.location.href = '/logout';
				}
				else
				{
					//提示错误
					alert('注销异常!');
					window.location.href = '/logout';
				}
			}
		)
	},

	/**
	 * 显示admin数据信息
	 *
	 * @param int sel_app_id 选择app ID
	 */
	show_cur_user: function(sel_app_id) {
		var _self = this;

		var def_app_id = 0;
		if(typeof(sel_app_id)!='undefined'){
			def_app_id = sel_app_id;
		}

		/**
		 * 获取当前用户
		 */
		$.post(this.url_get_cur_user, {'is_ajax':1},
			function(data){
				var d = data.revert_json();
				if(d.return_code==1){
					var ud = d.data;
					_self.user_data = d.data;
					_self.init_user_info(ud);
					_self.init_user_app(ud.permission.app_list, def_app_id);
				}
				else{
					window.location.href= '/logout';
				}
			}	
		);
	},

	/**
	 * 初始化用户信息
	 */
	init_user_info: function(user_data) {
		if(this.is_undef(user_data)){
			return;
		}

		var html = '';
		html += '<div class="faceimg"><img src="'+STATIC_ADMTOOLS_VERSION_URL+'/images/userface.png" /></div>';
		html += '<div class="select user-select">';
		html += '  <p class="f14 fy"> <span>'+user_data.username+'('+user_data.nickname+')</span> <i class="iF iF-arrdown right"></i></p>';
		html += '  <input  type="hidden"  value=""/>';
		html += '  <ol class="option" style="display:none; padding:0;">';
		html += '    <li>个人资料</li>';      
		html += '  </ol>';
		html += '</div> ';
		$('#user_info').html(html);	
	},

	/**
	 * 初始化用户app数据和菜单数据
	 *
	 * @param array app_list 应用列表
	 * @param int sel_app_id 选中app_id
	 *
	 * @return
	 */
	init_user_app: function(app_list, sel_app_id) {
		if(this.is_undef(app_list)){
			return;
		}
		var html = '';
		var def_app_id = 0;
		if(typeof(sel_app_id)!='undefined'){
			def_app_id = sel_app_id;
		}
		for(var i=0; i<app_list.length; i++){
			html += '<div id="app_tab_menu_'+app_list[i].app_id+'" class="site1">';
			html += '  <a href="javascript:admtools.show_cur_user('+app_list[i].app_id+')">';
			html += '	 <h3>';
			html += '	   <strong>'+app_list[i].name+'</strong>';
			html += '    </h3>';
			html += '  </a>';
			html += '</div>';
			//默认app
			if(def_app_id ==0 && i==0){
				def_app_id = app_list[i].app_id;
			}
		}
		if(def_app_id > 0){
			this.select_app(def_app_id);
		}

		$('#siteTab').html(html);

		//选择应用加亮
		$("[id^='app_tab_menu_']").removeClass('on');
		$("#app_tab_menu_"+def_app_id).addClass('on');
	},

	/**
	 * 选中app
	 */
	select_app: function(app_id) {
		
		var _self = this;

		if(this.is_undef(app_id)){
			return;
		}
		/**
		 * 获取当前用户
		 */
		$.post(this.url_get_cur_menus, {'is_ajax':1, 'app_id': app_id},
			function(data){
				var d = data.revert_json();
				if(d.return_code==1){
					var md = d.data;
					var m_html = _self.init_menus(md, 0);
					$('#app_menus').html(m_html);
					_self.bind_left_menus();
				}
			}	
		);


		//显示当前app名称
		for(var i=0; i<_self.user_data.permission.app_list.length; i++){
			if(_self.user_data.permission.app_list[i].app_id == app_id){
				$('#menu_app_name').html(_self.user_data.permission.app_list[i].name);
				break;
			}
		}
	},

	/**
	 * 初始化菜单
	 */
	init_menus: function(menus_data, parent_menu_id) {
		if(this.is_undef(menus_data)){
			return;
		}
		var htm = '';
		//显示子菜单逻辑: 如果父级菜单有
		for(var i=0; i<menus_data.length;i++){

			var m_htm = '';
			//如果匹配了当前菜单是指定的父级菜单,则迭代
			if(parent_menu_id == menus_data[i].parent_menu_id){

				var has_permission = 0;
				//如果有具体的opt_id,才做权限判断
				if(menus_data[i].opt_id>0){
					if(!this.is_undef(this.user_data.permission.permission_data[menus_data[i].opt_id])){
						has_permission = 1;
					}
				}

				//第一级菜单(n=1)
				if(parent_menu_id==0){
					m_htm += '<h4>\n';
					m_htm += '  <span class="right iF iF-jia"></span>\n';
					m_htm += '  <a id="menu_'+menus_data[i].menu_id+'" href="javascript:void(0)">\n';
					m_htm += '    <i class="iF iF-guanli"></i>\n';
					m_htm += '    <span class="text">'+menus_data[i].name+'</span>\n';
					m_htm += '  </a>\n';
					m_htm += '</h4>\n';
				}
				else
				//第n级菜单(n>1)
				if(parent_menu_id>0){
					m_htm += '  <h5>{child_flag}<a id="menu_'+menus_data[i].menu_id+'" href="javascript:void(0)">'+menus_data[i].name+'</a></h5>\n';
				}

				//递归子菜单的数据
				var htm_tem = this.init_menus(menus_data, menus_data[i].menu_id);

				//整理菜单数据
				this.menus_data[menus_data[i].menu_id] = menus_data[i];
	
				//有子菜单
				if(htm_tem!=''){
					m_htm += '<div class="menusub">\n';
					m_htm += '  '+htm_tem;
					m_htm += '</div>\n';
					m_htm = m_htm.replace('{child_flag}', '<i class="iF iF-right"></i>');
					this.menus_data[menus_data[i].menu_id]['has_children'] = 1;

					htm += m_htm;
				}
				//无子菜单
				else		
				{
					m_htm = m_htm.replace('{child_flag}', '&nbsp;&nbsp;&nbsp;');
					this.menus_data[menus_data[i].menu_id]['has_children'] = 0;

					if(has_permission==1){
						htm += m_htm;
					}
				}
			}
		}

		return htm;
	},

	/**
	 * 绑定菜单
	 */
	bind_left_menus : function(){
		var Lt=$("#lt");
		var menus_a=$("#ltFold").find("a");//被点击的链接
		var _self = this;
		
		//增加菜单tab
		function add_menu_tab(md){
			var tab_li='<li id="menu_tab_'+md.menu_id+'"><span>'+md.name+'</span><i class="iF iF-close">&#xe606;</i></li>';	

			var ifr_url = _self.url_route_opt_url+'?opt_id='+md.opt_id;
			
			//把opt_id转换成直接地址,这样会跳转会更快,不需要通过router_opt去解析跳转
			if(!_self.is_undef(_self.user_data.permission.permission_data[md.opt_id])){
				var app_code = _self.user_data.permission.permission_data[md.opt_id].app_code;
				var dir_code = _self.user_data.permission.permission_data[md.opt_id].module_dir;
				var module_code = _self.user_data.permission.permission_data[md.opt_id].module_code;
				var action_code = _self.user_data.permission.permission_data[md.opt_id].action_code;
				if(dir_code == null || dir_code==''){
					ifr_url = '/'+app_code+'/'+module_code+'/t_'+action_code;
				}else{
					ifr_url = '/'+app_code+'/'+dir_code+'/'+module_code+'/t_'+action_code;
				}
			}
			
			var tab_iframe ='<iframe id="ifr_'+md.menu_id+'" src="'+ifr_url+'" style="display:none;border:0px;width:100%"></iframe>'; //创建iframe
			$("#mainCon").append(tab_iframe);	 //iframe 加入到页面	
			$("#pageList").append(tab_li);
			show_menu_tab(md.menu_id);
			//菜单tab绑定点击事件
			var tab_li_list = $("#pageList").find("li");
			tab_li_list.off("click");
			tab_li_list.on("click",function(){
				var menu_id = $(this).attr('id').replace('menu_tab_','');
				show_menu_tab(menu_id);
			});
			//菜单关闭点击事件
			$("#pageList").find(".iF-close").off("click");
			$("#pageList").find(".iF-close").on("click",function(e){
				var menu_id = $(this).closest('li').attr('id').replace('menu_tab_','');
				del_menu_tab(menu_id);
			});
		}

		//删除菜单tab
		function del_menu_tab(menu_id){
			var mcd = _self.menus_click_data;
			//检查点击过的函数是否存在
			var last_menu_id = 0;
			for(var i=0; i<mcd.length; i++){
				if(mcd[i].menu_id == menu_id){
					_self.menus_click_data.splice(i,1);
					break;
				}
				last_menu_id = mcd[i].menu_id;
			}

			$('#menu_tab_'+menu_id).remove();
			$('#ifr_'+menu_id).remove();

			//如果删除的是当前显示的菜单, 则显示另一个相邻的菜单项
			if(_self.cur_menu_id == menu_id){
				show_menu_tab(last_menu_id);
			}
			
		}

		//显示当前菜单tab
		function show_menu_tab(menu_id){
			var ifr_list=$("#mainCon").find("iframe");//获取iframe列表	
			var tab_li_list=$("#pageList").find("li");
			//显示点击的当前iframe 并隐藏其他iframe
			ifr_list.hide();
			$("#ifr_"+menu_id).show();
			//显示当前tab 并影藏其它tab
		    tab_li_list.removeClass("on");
		    $('#menu_tab_'+menu_id).addClass("on");

			//点击高亮
			$("#ltFold").find("h5").removeClass("on");
			$("#menu_"+menu_id).closest("h5").addClass("on");

			//设置高度
			updateMainHeight();
			updateFrameHeight(menu_id);

			//赋值当前的菜单
			_self.cur_menu_id = menu_id;
		}

		//折叠菜单 	
		function slideDownUp(v){
			//定义点击展开收缩的通用函数
			try{
				v.eClick.off("click");
				v.eClick.on("click",function(e){		
					var _this = $(this);
					var menuSub=v.toggleEle(_this);
					if(menuSub.is(":hidden")){
						_this.removeClass(v.className1);
						_this.removeClass(v.className2);
						//_this.addClass(v.className1);		
						menuSub.slideDown(100);
					}
					else{
						_this.removeClass(v.className1);
						_this.removeClass(v.className2);
						_this.addClass(v.className1);
						menuSub.slideUp(100);
					}
				});
			}
			catch(err){console.log(err)}
		}

		//iframe 高度自适应
		function updateMainHeight(){
			  var pageH=$(".pageList").height();
			  var H=$(window).height()-80-pageH;
			  $("#mainCon").height(H);
			} 

		//iframe 高度初始化
		function updateFrameHeight(menu_id){
			var id_str = 'ifr_'+menu_id;
			if(menu_id == 0){
				var height = $('#mainCon').height()-10;
				$("#"+id_str).height(height);
				return;
			}

			//$("#"+id_str).load(function(){
				$(this).height(0); //用于每次刷新时控制IFRAME高度初始化 
				//var height = $(this).contents().height() + 10;
				var height = $('#mainCon').height()-10;
				$("#"+id_str).height(height); 
			//});
		}

		//菜单绑定点击事件
		menus_a.off("click");
		menus_a.on("click", function(){
			var menu_id = $(this).attr('id').replace('menu_','');
			if(_self.is_undef(_self.menus_data[menu_id])){
				alert('未定义菜单ID('+menu_id+')');
			}

			//如果是-1没有任何触发, 一般用于没权限的父菜单, 但是下面有子菜单
			if(menu_id==-1){
				return;
			}

			var md = _self.menus_data[menu_id];
			var mcd = _self.menus_click_data;

			//判断是否是有效
			if(md.has_children==1){
				return;
			}

			//检查点击过的函数是否存在,存在则显示
			for(var i=0; i<mcd.length; i++){
				if(mcd[i].menu_id == menu_id){
					show_menu_tab(menu_id);
					return;
				}
			}
			mcd.push(md);

			//添加菜单tab
			add_menu_tab(md);

		});

		//左菜单隐藏显示
		$(".ltInOut").off("click");
		$(".ltInOut").on("click",function(){
			var Lt = $('#lt');
			var Gt = $('#gt');
			if(Lt.is(":hidden")){
			  Lt.show();
			  Gt.css("left","226px");
			  $(this).html("收<br />缩<br />&lt;").css("left","226px");
			}
			else{
			  Lt.hide();
			  Gt.css("left","0");
			  $(this).html("展<br />开<br />&gt;").css("left","0");
			}
		});

		//绑定菜单伸缩效果
		var clE= $("#ltFold").find(" .iF-right");
		slideDownUp({eClick:clE,className1:"drapDown",className2:"drapUp",toggleEle:function(t){
			return t.closest("h5").next(".menusub");
		}});

		//初始化默认页高度
		updateMainHeight();

		//初始化frame高度
		updateFrameHeight(0);

		//自适应高度
		$(window).resize(function(){updateMainHeight();updateFrameHeight(_self.cur_menu_id)});
	}


}