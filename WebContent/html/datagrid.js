/**
 * 数据表格
 */
(function($){
	var cacheData = {
		_cacheIndex:0,
		nextIndex:function(){
			cacheData._cacheIndex++;
			return cacheData._cacheIndex;
		}
	};
	
	$.fn.datagrid = function(options){
		var _container = this;
		var cacheOp = _container.data("datagrid-cacheOp");
		if(cacheOp != null){
			return cacheOp;
		}
		
		var config = {
			data:[],
			url:null,
			columns:null,
			fieldRow:"field-row",
			fixedTitle:false,
			fieldTitle:"field-title",
			field:"field",
			fieldOptions:"field-options",
			usefulSpace:0,
			moreClass:"datagrid-more",
			activeClass:"active",
			fieldTree:"field-tree",
			fieldChildren:"field-children",
			iconMargin:30,
			referName:"data-refer",
			triggerEvent:"click.gridTree",
			triggerActive:"field-active",
			selfTrigger:true,
			selectable:false,
			isTree:false
		};
		
		$.extend(config,options);
		
		var gridTemplate = {
				rowHeader:"<div class='datagrid-header' style='white-space:nowrap;'></div>",
				cellTitle:"<div class='datagrid-cell datagrid-title'>&nbsp;</div>",
				row:"<div class='datagrid-row' style='white-space:nowrap;'></div>",
				cell:"<div class='datagrid-cell'>&nbsp;</div>",
				rootWrapper:"<div class='datagrid-rootWrapper'></div>",
				childrenWrapper:"<div class='datagrid-childrenWrapper'></div>",
				treeIcon:"<span class='datagrid-tree-icon'></span>",
				resizeBar:"<div class='datagrid-resizeBar' style='position:absolute;z-index:100;'></div>"
		};
		
		var _header = _container.find(".datagrid-header");//标题,固定写法1
		var _headerOffset = {left:0,top:0};
		var _maxGrade = 0;
		var _resizeBar = $(gridTemplate.resizeBar).appendTo("body");//调整宽度工具
		var _resizeProp = null;
		var _resizeAble = false;
		
		var sheetOp = {
			_cacheSheet:null,
			fetchSheet:function(){
				if(sheetOp._cacheSheet != null){
					return sheetOp._cacheSheet;
				}
				var styleDom = $("<style type='text/css'></style>").appendTo("body").get(0);
				var sheet = styleDom.sheet || styleDom.styleSheet|| document.styleSheets[document.styleSheets.length - 1];
				sheetOp._cacheSheet = sheet;
				return sheetOp._cacheSheet;
			},
			fetchRule:function(name){
				var sheet = sheetOp.fetchSheet();
				var rules = sheet.cssRules || sheet.rules;
				var findRule = null;
				for(var i = 0; i < rules.length; i++){
					var rule = rules[i];
					if(rule.selectorText == name){
						findRule = rule;
					}
				}
				return findRule;
			},
			addOrUpdate:function(name, ruleObj){
				var sheet = sheetOp.fetchSheet();
				var rules = sheet.cssRules || sheet.rules;
				var findRule = sheetOp.fetchRule(name);
				if(findRule != null){
					$.extend(findRule.style,ruleObj);
				}else{
					var ruleText = "";
					for(var key in ruleObj){
						ruleText += key + ":" + ruleObj[key] + ";";
					}
					if(sheet.insertRule != null){
						sheet.insertRule(name + "{"+ruleText+"}",rules.length);
					}else if(sheet.addRule != null){
						sheet.addRule(name,ruleText,rules.length);
					}
				}
				
				return name;
			}
		};
		
		function chNum(str){
			var num = parseFloat(str.replace("px",""));
			if(isNaN(num)){
				num = 0;
			}
			return num;
		}
		
		/**
		 * 获取行
		 */
		function fetchFieldRowList(){
			var fieldRowList = _container.find("["+config.fieldRow+"]");
			return fieldRowList;
		}
		
		/**
		 * 获取标题字段
		 */
		function fetchFieldTitleList(){
			var fieldList = _container.find("["+config.fieldTitle+"]");
			return fieldList;
		}
		
		/**
		 * 获取普通字段
		 */
		function fetchFieldList(){
			var fieldList = _container.find("["+config.field+"]");
			return fieldList;
		}
		
		/**
		 * 获取字段配置
		 */
		function generateFieldProp(fieldDom){
			var prop = {};
			var fieldOptions = fieldDom.attr(config.fieldOptions);
			if(fieldOptions != null){
				prop = new Function("return " + fieldOptions).call(fieldDom);
			}
			return prop;
		}
		
		/**
		 * 约定属性：dom,name,title,className,width
		 * 可选参数changeProp,changeSize
		 */
		function calculateStyle(fieldPropList){
			var total = 0;
			var totalWidth = _container.width();
			if(totalWidth == 0){
				var preDisplay = _container.prop("style").display;
				if(_container.css("display") == "none"){
					_container.show();
					totalWidth = _container.width();
					_container.css("display",preDisplay);
				}
			}
			
			totalWidth -= config.usefulSpace;//减去预留空间
			
			$.each(fieldPropList,function(index, fieldProp){
				var wth = fieldProp.width;
				if(wth == null || wth < 1){
					fieldProp.width = 1;
					wth = fieldProp.width;
				}
				total += wth;
			});
			
			$.each(fieldPropList,function(index,fieldProp){
				var dom = fieldProp.dom;
				var scale = Math.floor(fieldProp.width / total * 100) / 100;
				var scaleWidth = totalWidth * scale;
				fieldProp.width = scaleWidth;//设置真实宽度
				var otherSize = chNum(dom.css("paddingLeft")) + chNum(dom.css("paddingRight"));
				otherSize += chNum(dom.css("marginLeft")) + chNum(dom.css("marginRight"));
				otherSize += chNum(dom.css("borderLeftWidth")) + chNum(dom.css("borderRightWidth"));
				var realWidth = scaleWidth - otherSize;
				var ruleObj = {
					"width":realWidth + "px",
					"overflow":"hidden",
					"white-space":"nowrap",
					"text-overflow":"ellipsis"
				};
				
				sheetOp.addOrUpdate("." + fieldProp.className,ruleObj);
				//记录跳动宽度的位置,误差8像素
				var basePos = dom.offset().left + scaleWidth;
				fieldProp.resizePosition = {left:basePos - 4,right:basePos + 4};
			});
			
		}
		
		/**
		 * 更新等级样式
		 */
		function updateGradeStyle(){
			var maxGradeClass = ".grade-cell-" + _maxGrade;
			if(sheetOp.fetchRule(maxGradeClass) == null){
				for(var i = 0; i <= _maxGrade;i++){
					var gradeClass = ".grade-cell-" + i + ">.datagrid-row .datagrid-tree-icon"; //固定写法2
					var marginSize = config.iconMargin * i;
					var ruleObj = {
						"margin-left":marginSize + "px"	
					};
					sheetOp.addOrUpdate(gradeClass, ruleObj);
				}
			}
			
		}
		
		/**
		 * 
		 * 渲染数据
		 * 
		 */
		function renderData(targetWrapper, data, fieldPropList,grade){
			if(fieldPropList == null){
				console.error("renderData error");
				return;
			}
			targetWrapper.empty();
			if(grade == null){
				grade = 0;
			}
			
			if(data != null){
				$.each(data,function(index,row){
					if(row == null){
						return true;
					}
					
					var $row = $(gridTemplate.row);
					//标记普通行
					$row.attr(config.fieldRow, index);
					$.each(fieldPropList,function(pI,prop){
						var textContent = null;
						var $cell = $(gridTemplate.cell);
						$cell.attr(config.field,prop.name);
						if(prop.format != null){
							textContent = prop.format.call(_container,row[prop.name],row,prop.name);
						}else{
							textContent = row[prop.name];
						}
						$cell.html(textContent);
						$cell.attr("title",textContent);
						$row.append($cell);
					});
					
					//指定容器
					targetWrapper.append($row);
					targetWrapper.attr(config.fieldChildren, grade);//记录了等级
					targetWrapper.addClass("grade-cell-" + grade);//等级样式
					if(grade > _maxGrade){
						_maxGrade = grade;
					}
					
					//是否存在子元素
					if(row.children != null && $.isArray(row.children)){
						var $childrenWrapper = $(gridTemplate.childrenWrapper);
						renderData($childrenWrapper,row.children,fieldPropList,grade + 1);
						targetWrapper.append($childrenWrapper);
					}
					
					
				});
			}
			
		}
		
		/**
		 * 
		 * 更新相关信息
		 * 
		 */
		function digestData(data,fieldPropList){
			//更新数据
			_container.children("["+config.fieldChildren+"]").remove();
			var $rootWrapper = $(gridTemplate.rootWrapper);
			renderData($rootWrapper,data,fieldPropList);
			_container.append($rootWrapper);
			
			//更新实际位置
			if(_header.css("position") != "fixed"){
				_headerOffset = _header.offset();
			}
			//更新样式表
			updateGradeStyle();
			//更新树形结构
			if(config.isTree){
				var treeList = fetchFieldRowList();//所有行记录 
				initTree(treeList);
			}
		}
		
		/**
		 * 构建表格数据
		 * 约定属性，name,title,width,format
		 */
		function initDatagridData(){
			var fieldPropList  = [];
			var columns = config.columns;
			if(columns != null){
				if($.isArray(columns)){
					//构建标题
					var $header = $(gridTemplate.rowHeader);
					$.each(columns,function(index, col){
						var $cellTitle = $(gridTemplate.cellTitle);
						$cellTitle.attr(config.fieldTitle,col.name);
						$cellTitle.html(col.title);
						$cellTitle.attr("title",col.title);
						$header.append($cellTitle);
						col.dom = $cellTitle;//设置dom
						fieldPropList.push(col);
					});
					
					_container.append($header);
					_header = $header;//标题
				}else{
					//nothing
				}
				
			}
			
			//更新数据
			if(config.data == null){
				config.data = [];
			}
			var data = config.data;
			digestData(data,fieldPropList);
			
			return fieldPropList;
		}
		
		/**
		 * 
		 * 构建表格属性
		 * 
		 */
		function initDatagridProp(fieldPropList){
			var titleList = fetchFieldTitleList();
			var fieldList = fetchFieldList();
			var fieldMap = {};
			fieldList.each(function(index,item){
				var $item = $(item);
				var fieldName = $item.attr(config.field);
				if(fieldName in fieldMap){
					fieldMap[fieldName] = fieldMap[fieldName].add($item);
				}else{
					fieldMap[fieldName] = $item;
				}
			});
			
			//获取dom元素中的配置
			if(fieldPropList == null || fieldPropList.length == 0){
				fieldPropList = [];//字段选项集合
				titleList.each(function(index, item){
					var $item = $(item);
					var prop = generateFieldProp($item);
					prop.dom = $item;
					prop.name = $item.attr(config.fieldTitle);
					prop.title = $item.text();
					fieldPropList.push(prop);
				});
			}
			
			//添加样式约束
			$.each(fieldPropList,function(index, prop){
				var dom = prop.dom;
				prop.className = "prop-cell-" + prop.name;//样式类名
				dom.addClass(prop.className);
				//添加其他字段样式
				var fields = fieldMap[prop.name];
				if(fields != null){
					fields.addClass(prop.className);
				}
				
			});
			
			//是否可以选中
			if(config.selectable){
				_container.on("click", "["+config.fieldRow+"]",function(evt){
					var $this = $(this);
					$this.toggleClass("selected");//选中样式
				});
				
			}
			
			//调动列宽,固定写法3
			_container.on("mousemove",".datagrid-header", function(evt){
				var findProp = null;
				$.each(fieldPropList,function(index,prop){
					if(prop.resizePosition != null && evt.pageX >= prop.resizePosition.left && evt.pageX <= prop.resizePosition.right){
						findProp = prop;
						return false;
					}
				});
				
				if(findProp){
					_container.css({cursor:"e-resize"});
					_resizeProp = findProp;
					_resizeAble = true;
				}else{
					_container.css({cursor:""});
					_resizeAble = false;
				}
				
			});
			
			_container.on("mousedown",".datagrid-header", function(evt){
				evt.preventDefault();
				evt.stopPropagation();
				if(_resizeAble){
					var curTop = _container.offset().top;
					_resizeBar.css({display:"block",height:_container.outerHeight(),left:evt.pageX,top:curTop});
					var barOffset = _resizeBar.offset();
					var diffSize = {x:evt.pageX - barOffset.left,y:evt.pageY - barOffset.top};
					$("body").off("mousemove").on("mousemove",function(evt){
						evt.preventDefault();
						evt.stopPropagation();
						_resizeBar.css({left:evt.pageX - diffSize.x});
					});
				}
			});
			
			$("body").on("mouseup", function(evt){
				$("body").off("mousemove");
				var barLeft = _resizeBar.position().left;
				
				if( _resizeProp != null && barLeft > 0 && (barLeft - _header.offset().left) > 0){
					var changeSize = 0;
					if(barLeft < _resizeProp.resizePosition.left){
						changeSize = barLeft - _resizeProp.resizePosition.left
					}
					if(barLeft > _resizeProp.resizePosition.right){
						changeSize = barLeft - _resizeProp.resizePosition.right;
					}
					var everyOne = Math.floor(changeSize / (fieldPropList.length - 1));
					if(Math.abs(everyOne) > 10){
						//update style
						$.each(fieldPropList,function(index,prop){
							if(_resizeProp == prop){
								return true;
							}
							prop.width -= everyOne;
						});
						_resizeProp.width += everyOne * (fieldPropList.length - 1);
						calculateStyle(fieldPropList);
					}
					
				}
				
				_resizeProp = null;
				_resizeBar.hide();
			});
			
			
			
			var $win = $(window);
			//是否滚定标题
			if(config.fixedTitle){
				$win.on("scroll",function(){
					var scrollTop  = $win.scrollTop();
					if(scrollTop >= _headerOffset.top){
						_header.css({position:"fixed",top:0,left:_headerOffset.left});
					}else{
						_header.css({position:"relative",top:0,left:0});
					}
					
				});
			}
			
			$win.on("resize",function(){
				//固定行级元素宽度
				sheetOp.addOrUpdate(".datagrid-header", {width:_container.width() + "px"});
				sheetOp.addOrUpdate(".datagrid-row", {width:_container.width() + "px"});
				calculateStyle(fieldPropList);
			});
			
			$win.resize();//init once
			
			return fieldPropList;
		}
		
		/**
		 * 构建树形结构
		 * 
		 */
		function treeTriggerHandler (item,isExpand){
			var $curItem = $(item);
			
			var referId = $curItem.attr(config.referName);
			if(referId != null){
				var $children = $("#" + referId);
				if($children.is(":animated")){
					return false;
				}
				
				if(isExpand === undefined){
					isExpand = !$curItem.hasClass(config.activeClass);
				}
				//激活样式
				if(isExpand){
					$curItem.addClass(config.activeClass);
					$children.slideDown(function(){
						//调整界面
						$(window).resize();
					});//animated
				}else{
					$curItem.removeClass(config.activeClass);
					$children.slideUp(function(){
						//调整界面
						$(window).resize();
					});//animated
				}

			}
			
			
		};
		
		/**
		 * 构建树形属性
		 */
		function  initTree(treeList){
			if(treeList == null){
				return;
			}
			treeList.each(function(index, item){
				var $item = $(item);
				var $children = $item.next("["+config.fieldChildren+"]");//子类集合
				var nextIndex = cacheData.nextIndex();//不会重复的数值
				var itemId = "gridTree_" + nextIndex;
				var childrenId = "gridTreeChildren_" + nextIndex;
				$item.attr("id",itemId);
				//添加图标
				var $firstCell = $item.children("["+config.field+"]").first();
				$firstCell.children(".datagrid-tree-icon").remove();//固定写法4
				$firstCell.prepend($(gridTemplate.treeIcon));
				if($children.length > 0){
					$item.addClass(config.moreClass);//更多样式
					$item.attr(config.referName,childrenId);
					$children.attr("id",childrenId);
					$children.attr(config.referName,itemId);
				}
				//event
				if(config.selfTrigger){
					$item.off(config.triggerEvent).on(config.triggerEvent,function(){
						treeTriggerHandler(this);
					});
				}
				
				$item.find("["+config.triggerActive+"]").off(config.triggerEvent).on(config.triggerEvent,function(){
					treeTriggerHandler(this);
				});
				
			});
			
		}
		
		//初始化操作
		_container.addClass("datagrid-table");
		var fieldPropList = initDatagridData();
		fieldPropList = initDatagridProp(fieldPropList);
		//是否构建树形功能
		if(config.isTree){
			var treeList = fetchFieldRowList();//所有行记录 
			initTree(treeList);
		}
		
		var op = {
			container:_container,
			config:config,
			fieldPropList:fieldPropList,
			gridTemplate:gridTemplate,
			digestData:digestData,
			render:function(){
				var data = this.config.data;
				this.digestData(data,this.fieldPropList);
			},
			updateRow:function(fieldData,index){
				var data = config.data;
				var rowData = data[index];
				if(rowData != null){
					data[index] = $.extend(rowData,fieldData);
					this.render(data);
				}
			},
			addRow:function(fieldData){
				var data = config.data;
				if(fieldData != null){
					data.push(fieldData);
					this.render(data);
				}
			},
			removeRow:function(index){
				var data = config.data;
				var rowData = data[index];
				if(rowData != null){
					data.splice(index,1);
					this.render(data);
				}
			},
			getRows:function(){
				return fetchFieldRowList();
			},
			getSelected:function(){
				return fetchFieldRowList().filter(".selected");
			},
			expand:function(id){
				treeTriggerHandler($("#" + id),true);
			},
			collapse:function(id){
				treeTriggerHandler($("#" + id),false);
			},
			expandAll:function(){
				var treeList = fetchFieldRowList();
				treeList.each(function(){
					treeTriggerHandler(this,true);
				});
			},
			collapseAll:function(){
				var treeList = fetchFieldRowList();
				treeList.each(function(){
					treeTriggerHandler(this,false);
				});
			}
		};
		
		_container.data("datagrid-cacheOp",op);
		return op;
	};
	
	
	
})(jQuery);
