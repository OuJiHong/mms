<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="/WEB-INF/jsp/include/header.jsp" %>


<script type="text/javascript">
	$(function(){
		
		function twoStr(num){
			
			if(num >= 10){
				return num + "";
			}
			
			return "0" + num;
			
		}
		
		
		function formatDate(date,pattern){
			var dateStr = "";
			if(pattern == null){
				pattern = "yyyy-MM-dd HH:mm:ss";
			}
			
			var repMap = {
					"yyyy":function(){
						return twoStr(date.getFullYear());
					},
					"MM":function(){
						return twoStr(date.getMonth() + 1);
					},
					"dd":function(){
						return twoStr(date.getDate());
					},
					"HH":function(){
						return twoStr(date.getHours());
					},
					"hh":function(){
						return twoStr(date.getHours() % 12);
					},
					"mm":function(){
						return twoStr(date.getMinutes());
					},
					"ss":function(){
						return twoStr(date.getSeconds());
					}
					
			};
			
			dateStr = pattern;
			for(var key in repMap){
				dateStr = dateStr.replace(key,repMap[key]);
			}
			return dateStr;
		}
		
		var $autoTime = $("#autoTime");
		setInterval(function(){
			$autoTime.html(formatDate(new Date(),"yyyy年MM月dd日   HH:mm:ss"));	
		},1000);
		
	});
	
</script>
<title>主界面</title>
</head>
<body class="easyui-layout" title="mms管理">
	
	<div data-options="region:'north'" style="height:34px;" >
		<div class="easyui-panel">
			本机地址:<b>http://<%=java.net.InetAddress.getLocalHost().getHostAddress() %>:<%=request.getLocalPort() %></b>
			<div style="float:right;padding-right:20px;">
				<a href="${base}/logout">退出</a>
			</div>
		</div>
	</div>
	<div data-options="region:'south',split:true" style="height:24px;">
		<div class="easyui-panel">
			<center><span id="autoTime"></span></center>
		</div>
	</div>
	<div data-options="region:'west',split:true" title="菜单" style="width:240px;">
		<div class="easyui-accordion">
			<div title="朋友圈" data-options="iconCls:'icon-ok'" >
				<ul>
					<li>
						<a  class="easyui-linkbutton" href="${base}/user/list" target="mainView">用户列表</a>
					</li>
					<li>
						<a  class="easyui-linkbutton" href="${base}/comment/list" target="mainView">评论列表</a>
					</li>
				</ul>
				
			</div>
		</div>
	</div>
	<!--  中间部分	 -->
	<div data-options="region:'center',title:'操作显示板块',iconCls:'icon-ok'">
			<iframe src="${base}/sysInfo"  frameborder="0" scrolling="no"  id="mainView"  name="mainView" style="width:100%;height:100%;">
			
			</iframe>
	</div>
	
</body>
</html>