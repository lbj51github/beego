/**
 * keivn.qin 上传类
 */
function kqUpload(params) {
	
}

/**
 * 上传原型处理
 *
 * 所有相关的url都需要在这里配置
 */
kqUpload.prototype = {


	params: {
		//指定表单
		form_id: 'form',
		form_name: 'form',
		//容器ID
		//container_id: 'uploadContainer',
		//选择按钮宽
		itemWidth: '60',
		//选择按钮高
		itemHeight: '32',
		//文件上传数
		file_index: 0,
		//处理控制器
		process_url: '/common/process_upload_file',
		//是否只读
		is_only_read: false
	},

	/**
	 * 初始化
	 * @param container_id
	 * 
	 */
	load: function(field_code){
		//上传路径
		this.params.upload_url = UPLOAD_URL;

		//判断是否是只读
		if($('#upload_file_is_only_read_'+field_code).length>0){
			this.params.is_only_read=true;
		}

		//模板视图
		var html = this.createView(field_code);
		$('#upload_image_'+field_code).append(html);

		$('.upload_append_list').each(function(){
			var fn = $(this).attr('id').replace('uploadList_', '');
			$("#uploadSuccess_" + fn).show();
		});

		this.addEvent();

	},
	
	/**
	 * 创建视图
	 */
	createView: function(field_code){
		var itemWidth = parseInt(this.params.itemWidth.replace("px", ""))-15;
		var itemHeight = this.params.itemHeight;
		var html = '';
		//只读不显示上传按钮
		if(!this.params.is_only_read){
			// 创建不带有拖动的html
			//html += '<form id="uploadForm" action="'+para.url+'" method="post" enctype="multipart/form-data">';
			html += '	<div class="upload_box">';
			html += '		<div class="upload_main single_main">';
			html += '			<div class="status_bar">';
			html += '				<div class="info">选中0张文件，共0B。</div>';
			html += '				<div class="btns">';
			html += '					<input type="file" size="30" class="upload_file" name="upload_files_'+field_code+'" multiple="multiple">';
			html += '					<div class="webuploader_pick">选择文件</div>';
			html += '					<div class="upload_btn">开始上传</div>';
			html += '				</div>';
			html += '			</div>';
			html += '			<div class="upload_preview">';
			//html += '				<div class="add_upload">';
			//html += '					<a style="height:'+itemHeight+';width:'+itemWidth+';" title="点击添加文件" class="add_imgBox" href="javascript:void(0)">';
			//html += '						<div class="uploadImg" style="width:'+itemWidth+'px">';
			//html += '							<img class="upload_image" src="'+STATIC_ADMTOOLS_VERSION_URL+'/js/kqUpload/images/add_img.png" style="width:expression(this.width > '+itemHeight+' ? '+itemHeight+'px : this.width)" />';
			//html += '						</div>';
			//html += '					</a>';
			//html += '				</div>
		}
		var img_path = $('#f_'+field_code).val();
		if(img_path!=''){
			var upload_file_abs_path = $('input[name="upload_file_abs_path_'+field_code+'"]').val();
			// 处理下配置参数和格式的html
			html += '<div class="upload_append_list" id="uploadList_'+ field_code +'">';
			html += '  <div class="file_bar">';
			html += '    <div style="padding:5px;">';
			html += '      <p class="file_name">已选中</p>';
			//只读不显示删除按钮
			if(!this.params.is_only_read){
				html += '      <span title="删除" data-index="0" class="file_del"></span>';
			}
			html += '    </div>';
			html += '  </div>';
			html += '  <a class="imgBox" href="javascript:kqUpload.show_image_layer(\''+field_code+'\')" style="height:100px;width:120px;">';
			html += '    <div style="width:105px" class="uploadImg">';
			html += '      <img style="width:expression(this.width &gt; 105 ? 105px : this.width)" src="'+this.params.upload_url+'/'+img_path+'" class="upload_image" id="uploadImage_'+ field_code +'">';
			html += '    </div>';
			html += '  </a>';
			html += '  <p class="file_progress" id="uploadProgress_'+ field_code +'"></p>';
			html += '  <p class="file_failure" id="uploadFailure_'+ field_code +'">上传失败，请重试</p>';
			html += '  <p class="file_success" id="uploadSuccess_'+ field_code +'"></p>';
			html += '</div>';
		}

		html += '			</div>';
		html += '		</div>';
		html += '		<div class="upload_submit">';
		html += '			<button type="button" id="fileSubmit" class="upload_submit_btn">确认上传文件</button>';
		html += '		</div>';
		html += '		<div id="uploadInf"  style=" display:none;" class="upload_inf"></div>';
		html += '	</div>';
		//html += '</form>';
	
		return html;
	},

	/**
	 * 得到预览HTML
	 *
	 * @param array(object) files 对象
	 * @param jq-object 上传对象
	 */
	getPreviewHtml: function(files, upload_file_dom) {
		var htm = '';
		var self = this;
		var file = files[0];
		var reader = new FileReader();
		var fn = upload_file_dom.attr('name').replace('upload_files_', '');

		reader.onload = function(e) {
			// 处理下配置参数和格式的html
			htm += '<div class="upload_append_list" id="uploadList_'+ fn +'">';
			htm += '  <div class="file_bar">';
			htm += '    <div style="padding:5px;">';
			htm += '      <p class="file_name">' + file.name + '</p>';
			htm += '      <span title="删除" data-index="0" class="file_del"></span>';
			htm += '    </div>';
			htm += '  </div>';
			htm += '  <a class="imgBox" href="javascript:kqUpload.show_image_layer(\''+fn+'\')" style="height:100px;width:120px;">';
			htm += '    <div style="width:105px" class="uploadImg">';
			htm += '      <img style="width:expression(this.width &gt; 105 ? 105px : this.width)" src="'+e.target.result+'" class="upload_image" id="uploadImage_'+ fn +'">';
			htm += '    </div>';
			htm += '  </a>';
			htm += '  <p class="file_progress" id="uploadProgress_'+ fn +'"></p>';
			htm += '  <p class="file_failure" id="uploadFailure_'+ fn +'">上传失败，请重试</p>';
			htm += '  <p class="file_success" id="uploadSuccess_'+ fn +'"></p>';
			htm += '</div>';

			//显示html
			upload_file_dom.closest('.upload_main').find('.upload_preview').html(htm);
			//设置消息
			self.setFileStatusInfo(files, upload_file_dom);
			//绑定经过事件
			self.evtBindHover();
			//绑定删除事件
			self.evtBindDel();
		}
		reader.readAsDataURL(file);
	},

	// 显示图片层
	show_image_layer: function(field_name){
		var v = $('#f_'+field_name).val();
		if(v==''){
			alert('非法的图片地址:'+v);
			return;
		}

		var src=this.params.upload_url+'/'+v;
		photos_json = {
		  "title": "预览", //相册标题
		  "id": 0, //相册id
		  "start": 0, //初始显示的图片序号，默认0
		  "data": [   //相册包含的图片，数组格式
			{
			  "alt": "预览",
			  "pid": 0, //图片id
			  "src": src, //原图地址
			  "thumb": "" //缩略图地址
			}
		  ]
		}

		//初始化照片预览
		layer.photos({
		    photos: photos_json
		});

		
	},

	// 绑定删除按钮事件
	evtBindDel: function(){
		if($(".file_del").length>0){
			// 删除方法
			$(".file_del").unbind('click').click(function() {
				$(this).closest('.upload_box').find('.upload_append_list').remove();
				var append_id = $(this).closest('.upload_append_list').prop('id');
				var val_id = append_id.replace('uploadList_', '');
				$('#f_'+val_id).val('');
				return false;	
			});
		}
		
		if($(".file_edit").length>0){
			// 编辑方法
			$(".file_edit").unbind('click').click(function() {
				// 调用编辑操作
				return false;	
			});
		}
	},
		
	// 绑定显示操作栏事件
	evtBindHover: function(){
		$(".upload_append_list").unbind('hover').hover(
			function (e) {
				$(this).find(".file_bar").addClass("file_hover");
			},function (e) {
				$(this).find(".file_bar").removeClass("file_hover");
			}
		);
	},

	/**
	 * 功能：显示统计信息和绑定继续上传和上传按钮的点击事件
	 * @param array(object) files 对象
	 * @param jq-object 上传对象
	 */
	setFileStatusInfo: function(files, upload_file_dom){
		var size = 0;
		var num = files.length;
		$.each(files, function(k,v){
			// 计算得到文件总大小
			size += v.size;
		});
		
		// 转化为kb和MB格式。文件的名字、大小、类型都是可以现实出来。
		if (size > 1024 * 1024) {                    
			size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';                
		} else {                    
			size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';                
		}  
		var htm = "选中"+num+"张文件，共"+size;
		//显示当前信息
		upload_file_dom.closest('.upload_main').find('.info').html(htm);

	},

	/**
	 * 建立一個可存取到file的url
	 * @param object file
	 *
	 */
	getObjectURL: function (file) {
		var url = null ; 
		if (window.createObjectURL!=undefined) { // basic
			url = window.createObjectURL(file) ;
		} else if (window.URL!=undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file) ;
		} else if (window.webkitURL!=undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file) ;
		}
		return url ;
	},

	/**
	 * 加上事件
	 */
	addEvent: function(){
		var self = this;
		// 如果快捷添加文件按钮存在
		if($(".webuploader_pick").length > 0){
			// 绑定选择事件
			$(".webuploader_pick").unbind('click').bind("click", function(e){
				$(this).siblings('.upload_file').click();
			});
		}

		//绑定改变显示事件
		$(".upload_file").unbind('change').change(function(){
			var file = this.files[0];
			var objUrl = self.getObjectURL(file);
			$(this).siblings('.upload_file').click();
			if (objUrl) {
				self.getPreviewHtml(this.files, $(this));
			}
		});

		//绑定上传点击事件
		$(".upload_btn").unbind('click').bind("click", function(e){

			var fn = $(this).siblings('.upload_file').attr('name').replace('upload_files_','');
			$(this).siblings('.upload_file').each(function(){
				self.processUploadFile(this.files[0], fn);
			});

			
			// 判断当前是否有文件需要上传
			/*
			if(ZYFILE.funReturnNeedFiles().length > 0){
				$("#fileSubmit").click();
			}else{
				alert("请先选中文件再点击上传");
			}
			*/
		});

		//绑定经过事件
		self.evtBindHover();
		//绑定删除事件
		self.evtBindDel();
	},

	/**
	 * 处理上传文件
	 * @param object file
	 * @param string fn
	 */
	processUploadFile: function(file, fn){
		var self = this;
		var fdata = new FormData();
		//传入相关的限制格式
		fdata.append("upload_file", file);
		var upload_file_abs_path = $('input[name="upload_file_abs_path_'+fn+'"]').val();
		fdata.append("upload_file_abs_path", upload_file_abs_path);
		var upload_file_folder = $('input[name="upload_file_folder_'+fn+'"]').val();
		fdata.append("upload_file_folder", upload_file_folder);
		var upload_file_type = $('input[name="upload_file_type_'+fn+'"]').val();
		fdata.append("upload_file_type", upload_file_type);
		var req = new XMLHttpRequest();
		req.open("POST", self.params.process_url , true);  
		req.onload = function(e) {
			if (req.status != 200) {
				$("#uploadSuccess_" + fn).hide();
			}else{
				var d = eval('('+req.responseText+')');
				$('#f_'+fn).val(d.data.url);
				$("#uploadSuccess_" + fn).show();
			}
		};
		req.send(fdata);
	}

}

