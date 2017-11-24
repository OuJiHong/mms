/**
 * 公用扩展
 * 
 */

(function($){
	
	var cacheData = {
			_index:100,
			nextIndex:function(){
				cacheData._index++;
				return cacheData._index;
			}
	};
	
	var util = {
		formatData:function(data, basePrefix){
			if(basePrefix == null){
				basePrefix = "";
			}
			
			if(data == null){
				return data;
			}
			var newData = {};
			for(var key in data){
				var value = data[key];
				var newKey = basePrefix + key;
				if(value != null && typeof value == "object"){
					var tmpData = util.formatData(value, newKey + ".");
					$.extend(newData,tmpData);
				}else{
					newData[newKey] = value;
				}
			}
			
			return newData;
			
		}
		
	};
	
	//全局
	window.util = util;
	
	//扩展...
	$.fn.render = function(data){
		var _this = this;
		
		if(_this.prop("nodeName") != "SCRIPT"){
			console.error("not support other tag");
			return null;
		}
		
		var html = template(_this.html())(data);
		return html;
	};
	
	$.fn.template = function(data){
		var _this = this;
		if(_this.prop("nodeName") != "SCRIPT"){
			console.error("not support other tag");
			return;
		}
		
		var templateId = _this.attr("id");
		if(templateId == null){
			templateId = "templateId_" + cacheData.nextIndex();
			_this.attr("id",templateId);
		}
		
		var wrapId = _this.attr("refer");
		if(wrapId == null){
			var tempWrap = $("<div></div>");
			wrapId = "templateWrapper_" + cacheData.nextIndex();
			tempWrap.attr("id",wrapId);
			_this.after(tempWrap);
			_this.attr("refer",wrapId);
		}
		
		var wrap = $("#" + wrapId);
		var html = template(templateId)(data);
		wrap.html(html)
		
	};
	
	
	//其他配置
	if(template != null){
		template.config("openTag","{");
		template.config("closeTag","}");
		
	}
	
})(jQuery);


//文件上传初始化
$(function(){
	var settings = window.settings;
	if(settings == null){
		settings = {};
	}
	
	var basePath = settings.base;
	var uploadUrl = basePath + "/file/upload";
	var $upload = $("[init-upload]");//扫描指定标识的dom元素
	$upload.css({position:"relative"});
	$upload.each(function(){
		var $this = $(this);
		var outName = $this.attr("init-upload");
		var fileInput = $("<input type='file' class='common-file-input' />");
		fileInput.attr("out-name",outName);
		$this.append(fileInput);
	});
	
	
	$upload.on("change", "input[type=file]", function(evt){
		var input = this;
		var $this = $(this);
		var outName =  $this.attr("out-name");
		if(input.files != null && input.files.length > 0){
			var formData = new FormData();
			formData.append("file",input.files[0]);
			var xhr = new XMLHttpRequest();
			xhr.open("post",uploadUrl, false);
			xhr.onload = function(){
				var dataStr = xhr.responseText;
				var jsonData = {};
				try{
					jsonData = $.parseJSON(dataStr);
				}catch(e){
					console.error("数据转换错误：" + e.stack);
				}
				
				if(jsonData.url != null){
					var topContainer = $this.closest("form");
					if(topContainer.length == 0){
						topContainer = $this.parent().parent();
					}
					var targetDom = topContainer.find("[name='" +outName + "']");
					var localUrl = settings.base + jsonData.url;
					if(targetDom.is(":input")){
						targetDom.val(localUrl);
					}else{
						targetDom.html(localUrl);
					}
					
				}else{
					$.messager.alert("提示信息","上传失败!" );
				}
				
			};
			
			xhr.onerror = function(){
				$.messager.alert("提示信息","上传失败:" + xhr.status);
			};
			
			xhr.send(formData);
			
			//clear
			input.value = "";
		}else{
			console.info("没有选择任何文件...");
		}
		
		
	});
	
	
});


//预览
$(function(){
	var propName = "data-preview";
	var $body = $("body");
	var $container = $("<div  data-id='previewCotnainer'></div>");
	$container.css({
		display:"none",
		position:"absolute",
		zIndex:90000,
		background:"white",
		width:100,
		height:100,
		border:"solid 1px #e2e2e2",
		borderRadius:"4px",
		padding:"4px"
	});
	$body.append($container);
	$body.on("mouseenter", "["+propName+"]", function(evt){
		var $this = $(this);
		var $form = $this.closest("form");
		var $img = $("<img alt='预览图片' class='responsive'/>");
		if($form.length > 0){
			var inputName = $this.attr(propName);
			var $input = $form.find(":input[name='"+inputName+"']");
			if($input.length > 0){
				var imgSrc = $input.val();
				$img.attr("src",imgSrc);
			}
		}
		
		$container.html($img);
		$container.show();
		$container.css({
			background:"white",
			top:$this.offset().top + $this.outerHeight(),
			left:$this.offset().left + (($this.outerWidth() - $container.outerWidth()) / 2)
		});
		
	});
	
	$body.on("mouseleave", "["+propName+"]", function(){
		$container.hide();
	});
	
	
	
});

