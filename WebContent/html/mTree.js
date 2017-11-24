/**
 * 移动端树形插件
 */
(function($){
	//插件数据缓存名称
	var MTREE_CACHE_NAME = "_mTree_data";
	
	//调用入口
	function mTree(treeData, options){
		var settings = $.extend({},mTree.defaults,options);
		//获取根元素
		var types = settings.types;
		var dataNames = settings.dataNames;
		var rootData = null;  
		if($.isArray(treeData)){
			rootData = {};
			rootData[dataNames.childName] = treeData;
			rootData[dataNames.nodeName] = "root";
		}else{
			rootData = treeData;
		}
		rootData[dataNames.nodeType] = "$root";//系统默认类型
		debugInfo("初始化配置完成，开始创建根元素");
		var $rootNode = new ItemNode(rootData, settings);
		//替换所有
		var $container = $(settings.treeContainer);
		if($container.parent().length == 0){
			$container.appendTo("body");
		}
		$container.html($rootNode.element);
		debugInfo("mTree成功加载数据");
		return {
			$rootNode:$rootNode,
			$container:$container
		};
	};
	
	/**
	 * 
	 * 默认配置
	 * @param dataNames 数据名称转换
	 * @param types 可用的节点类型
	 * 
	 */
	var defaults = mTree.defaults = {
		debug:false,
		triggerEvent:"click",
		clickEvent:"click",
		treeContainer:"<div class='mTreeContainer' style='overflow:auto;'></div>",
		titleWrapper:"<div class='treeTitle' ></div>",
		dataNames:{
			titleWrapper:"titleWrapper",
			childName:"child",
			nodeName:"name",
			nodeType:"type",
			url:"url",
			handler:"handler"
		},
		types:{
			$root:{
				elementTag:"div",
				icon:"+",
				className:"",
				css:{
					backgroundColor:"white",
					border:"solid 1px #ccc",
					padding:"4px",
					color:"#555"
				}
			},
			$wrapper:{
				elementTag:"ul",
				icon:"+",
				className:"",
				css:{
					listStyle:"none",
					padding:"0px 0px 0px 40px",
					overflow:"hidden",
					opacity:0
				}
			},
			item:{
				elementTag:"li",
				icon:"+",
				className:"",
				css:{
					fontSize:"14px",
					padding:"8px 0px",
					lineHeight:1.8
				}
			}
		}
		
	};
	
	/**
	 * 显示debug信息
	 */
	function debugInfo(msg , error){
		if(defaults.debug && typeof console == "object"){
			var errorInfo = "";
			if(error != null){
				errorInfo - error.message;
			}
			console.log("debug:" + msg, errorInfo);
		}
	}
	
	/**
	 * 警告信息
	 */
	function warnInfo(msg){
		if(typeof console == "object"){
			console.warn("警告：" + msg);
		}
	}
	
	/**
	 * 判断数据是否是空的
	 */
	function isNotEmpty(val){
		if($.trim(val).length == 0){
			return false;
		}
		return true;
	}
	
	
	/**
	 * 获取节点数据中的属性
	 * dataNames配置的名称
	 */
	function fetchProp(data, name, settings){
		var dataNames = settings.dataNames;
		var realName = dataNames[name];
		return data[realName];
	}
	
	/**
	 * 节点类型
	 */
	function ItemNode (itemData, settings){
		if(this instanceof ItemNode){
			var titleWrapper = fetchProp(itemData,"titleWrapper",settings);
			var name = fetchProp(itemData,"nodeName",settings);
			var type = fetchProp(itemData, "nodeType",settings);
			this.settings = settings;
			this.url = fetchProp(itemData, "url",settings);
			this.handler = fetchProp(itemData, "handler",settings);
			this.nodeValue = itemData;
			if(isNotEmpty(settings.titleWrapper)){
				this.titleWrapper = settings.titleWrapper;
			}
			if(isNotEmpty(titleWrapper)){
				this.titleWrapper = titleWrapper;
			}
			if(isNotEmpty(name)){
				this.nodeName = name;
			}
			if(isNotEmpty(type)){
				this.nodeType = type;
			}
			debugInfo("创建节点：" + this.nodeName + ",类型：" +  this.nodeType);
			this.element = createElement(this, settings);
			internalRender(this, settings);
			
			//缓存加载的数据
			this.element.data(MTREE_CACHE_NAME, this);
			//绑定事件,添加标题上
			this.titleWrapper.on(settings.triggerEvent,function(evt){
				evt.stopPropagation();//阻止冒泡
				var $element = $(this).parent();
				var itemNode = $element.data(MTREE_CACHE_NAME);
				if(itemNode.isExpand()){
					itemNode.collapse();
					debugInfo("折叠节点：" + itemNode.nodeName);
				}else{
					itemNode.expand();
					debugInfo("展开节点：" + itemNode.nodeName);
				}
			});
			
			return;
		}
		
		throw new Error("ItemNode 必须通过'new'关键字创建");
	};
	
	//设置原型
	ItemNode.prototype = {
		 settings:{},
		 titleWrapper:defaults.titleWrapper,
		 nodeName:"-",
		 nodeType:"item",
		 nodeValue:{},
		 url:null,
		 handler:null,
		 element:$(),
		 childData:function(){
			 var itemData = this.nodeValue;
			 var child = fetchProp(itemData, "childName", this.settings);
			 return child;
		 },
		 parentData:function(){
			 var parentWrapper = this.parentWrapper();
			 var parentElement = parentWrapper.parent();
			 var parentNode = parentElement.data(MTREE_CACHE_NAME);
			 if(parentNode != null){
				 return parentNode.nodeValue;
			 }
			 return null; 
		 },
		 expand:function(){
			 //展开子节点
			 var $this = this;
			 if($this.hasChild()){
				 $this.titleWrapper.removeClass("empty");
				 var settings = $this.settings;
				 var childData = $this.childData();
				 var childWrapper = $this.childWrapper();
				 if(childWrapper.length > 0){
					 changeNodeStatus(true, childWrapper, $this);
				 }else{
					 //创建子节点
					 var wrapperNode = {};
					 wrapperNode.nodeType = "$wrapper";
					 childWrapper = createElement(wrapperNode, settings);
					 wrapperNode.element = childWrapper;
					 internalRender(wrapperNode, settings);
					 childWrapper.empty();
					 $.each(childData, function(index, itemData){
						 var childNode = new ItemNode(itemData, settings);
						 childWrapper.append(childNode.element);
					 });
					 $this.element.append(childWrapper);
					 changeNodeStatus(true, childWrapper, $this);
				 }
			 }else{
				 //nothing
				 $this.titleWrapper.addClass("empty");
			 }
			 
		 },
		 collapse:function(){
			 //折叠子节点
			 var $this = this;
			 if($this.hasChild()){
				 var childWrapper = $this.childWrapper();
				 changeNodeStatus(false, childWrapper, $this);
			 }else{
				 //nothing 
				 
			 }
		 },
		 hasChild:function(){
			 var childData = this.childData();
			 if(childData != null && childData.length > 0){
				 return true;
			 }
			 return false;
		 },
		 hasParent:function(){
			 var parentData = this.parentData();
			 if(parentData != null){
				 return true;
			 }
			 return false;
		 },
		 childWrapper:function(){
			 var $wrapper = this.settings.types.$wrapper;
			 var classSelector = $wrapper.className ? $wrapper.className.replace(/^\s*|\s+/g,".") : "";
			 var childWrapper = this.element.children($wrapper.elementTag + classSelector);
			 return childWrapper;
		 },
		 parentWrapper:function(){
			 var $wrapper = this.settings.types.$wrapper;
			 var classSelector = $wrapper.className ? $wrapper.className.replace(/^\s*|\s+/g,".") : "";
			 var parentWrapper = this.element.closest($wrapper.elementTag + classSelector);
			 return parentWrapper;
		 },
		 isExpand:function(){
			//是否展开
			 var child = this.childWrapper();
			 if(child.is(":visible")){
				 return true;
			 }
			 return false;
		 },
		 isCollapse:function(){
			 //是否折叠
			 var child = this.childWrapper();
			 if(child.is(":hidden")){
				 return true;
			 }
			 return false;
		 }
	};
	
	/**
	 * 创建元素
	 * 
	 */
	function createElement(itemNode,settings){
		var nodeType = itemNode.nodeType;
		var types = settings.types;
		var element = $();
		var tt = types[nodeType];
		if(tt != null){
			element = $(document.createElement(tt.elementTag));
		}else{
			warnInfo("未能创建元素，不支持的nodeType类型：" + nodeType);
		}
		return element;
	}
	
	/**
	 * 
	 * 渲染数据样式
	 * 
	 */
	function internalRender(itemNode, settings){
		var $el = itemNode.element;
		var $title =  $(itemNode.titleWrapper);
		itemNode.titleWrapper = $title;
		//添加数据
		if(itemNode.url != null){
			var anchor = $("<a href='"+itemNode.url+"'>"+itemNode.nodeName+"</a>");
			$title.html(anchor);
		}else{
			$title.html(itemNode.nodeName);
		}
		
		$el.html($title);
		
		if(itemNode.handler != null && $.isFunction(itemNode.handler)){
			$title.on(settings.clickEvent, function(evt){
				evt.stopPropagation();
				itemNode.handler();
			});
		}
		
		var types = settings.types;
		//根据nodeType添加
		var tt = types[itemNode.nodeType];
		if(tt != null){
			$el.addClass(tt.className);
			$el.css(tt.css);
			$title.prepend(tt.icon);
		}
		
	};
	
	/**
	 * 改变状态
	 * 
	 */
	function changeNodeStatus(isVisible, target, itemNode){
		var duration = 300;//持续时间
		if(isVisible){
			itemNode.titleWrapper.addClass("expand");//添加样式
			var oldOverflow = target.css("overflow");
			target.css({overflow:"hidden",visibility:"visibility",display:"block"});
			target.animate({opacity:1,height:target.prop("scrollHeight")},duration,function(){
				target.css({overflow:oldOverflow,height:"auto"});
				 var onExpand = itemNode.nodeValue.onExpand;
				 if($.isFunction(onExpand)){
					 onExpand.call(itemNode.element);
				 }
			});
		}else{
			itemNode.titleWrapper.removeClass("expand");//移除样式
			var oldOverflow = target.css("overflow");
			target.css("overflow","hidden");
			target.animate({opacity:0,height:"0px"},duration,function(){
				target.css("overflow",oldOverflow);
				target.hide();
				 var onCollapse = itemNode.nodeValue.onCollapse;
				 if($.isFunction(onCollapse)){
					 onCollapse.call(itemNode.element);
				 }
			});
		}
		
	}
	
	//注入到全局
	window.mTree = mTree;
	
})(jQuery);

