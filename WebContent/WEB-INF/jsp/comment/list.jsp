<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="/WEB-INF/jsp/include/header.jsp" %>

<title>评论列表</title>

<script type="text/javascript">
	
	$(function(){
		
		var typeMap = {
				"publish":"发表",
				"comment":"评论"
		};
		
		var $datagridTable = $("#datagridTable");
		$datagridTable.datagrid({
			url:"listJson",
			columns:[[
			          {field:"id",title:"编号",width:80},
			          {field:"type",title:"类型",width:80,formatter:function(value){
			        	  return typeMap[value];
			          }},
			          {field:"msgTitle",title:"消息标题",width:100,formatter:function(value,row){
			        	  var msg = row.msg;
			        	  return msg != null ?  msg.title : msg;
			        	  
			          }},
			          {field:"msgContent",title:"消息内容",width:300,formatter:function(value,row){
			        	  var msg = row.msg;
			        	  var content = msg != null ?  msg.content : msg;
			        	  return "<div class='common-limit-content'>" + content + "</div>";
			        	  
			          }},
			          {field:"msgShareUrl",title:"分享的连接",width:100,formatter:function(value,row){
			        	  var msg = row.msg;
			        	  return msg != null ?  msg.shareUrl : msg;
			        	  
			          }},
			          {field:"publishUser",title:"发布者",width:100,formatter:function(user){
			        	  return user != null ? user.userName : user;
			          }},
			          {field:"laudUsers",title:"点赞数量",width:60,formatter:function(laudUsers){
			        	  return laudUsers != null ? laudUsers.length : laudUsers;
			          }},
			          {field:"coverComments",title:"评论数量",width:60,formatter:function(coverComments){
			        	  return coverComments != null ? coverComments.length : coverComments;
			          }},
			          {field:"createDate",title:"创建时间",width:80},
			          {field:"modifyDate",title:"修改时间",width:80},
			          {field:"operation",title:"操作",formatter:function(value,row){
			        	  var opStr = "";
			        	  opStr += "<a href='javascript:;'  data-laud='"+row.id+"' class='easyui-linkbutton'>点赞</a>&nbsp;&nbsp;";
			        	  opStr += "<a href='javascript:;'  data-cover='"+row.id+"'  class='easyui-linkbutton'>评论</a>&nbsp;&nbsp;";
			        	  opStr += "<a href='friendInfo?id="+row.id+"'  class='easyui-linkbutton'>详情</a>&nbsp;&nbsp;";
			        	  return opStr;
			          }}
			]],
			method:"get",
			border:false,
			singleSelect:true,
			fit:true,
			fitColumns:true,
			toolbar:"#toolBar",
			onSelect:function(index,row){
				var id = row.id;
				var prefix = window.settings != null ? window.settings.localAddress : ""; 
				var address = prefix + "/comment/friendInfo?id=" + id;
				var archor = "<a href='"+address+"' target='_blank' >"+address+"</a>";
				$("#friendStatus").html(archor);
			}
		});
		
		
		//修改对话框
		$("#addDialog").dialog({
			modal:true,
			closed:true,
			width:480,
			buttons: [{
				text:"保存",
				iconCls:"icon-ok",
				handler:function(){
					$("#addForm").form("submit",{
						success:function(dataStr){
							var data = {};
							try{
								data = $.parseJSON(dataStr);
							}catch(e){
								console.error("json数据错误：" + e.stack);
							}
							if(data.type == "success"){
								$("#addDialog").dialog("close");
								$("#datagridTable").datagrid("reload");
							}else{
								$.messager.alert("提示","数据提交错误");
							}
						}
					});
				}
			},{
				text:'取消',
				iconCls:"icon-cancel",
				handler:function(){
					$("#addDialog").dialog("close");
				}
			}]
		});
		
		$("#laudDialog").dialog({
			closed:true,
			modal:true,
			width:480,
			buttons: [{
				text:"确认",
				iconCls:"icon-ok",
				handler:function(){
					$("#laudForm").form("submit",{
						success:function(dataStr){
							var data = {};
							try{
								data = $.parseJSON(dataStr);
							}catch(e){
								console.error("json数据错误：" + e.stack);
							}
							if(data.type == "success"){
								$("#laudDialog").dialog("close");
								$("#datagridTable").datagrid("reload");
							}else{
								$.messager.alert("提示","数据提交错误");
							}
						}
					});
				}
			},{
				text:'取消',
				iconCls:"icon-cancel",
				handler:function(){
					$("#laudDialog").dialog("close");
				}
			}]
		});
		
		
		$("#coverDialog").dialog({
			closed:true,
			modal:true,
			width:480,
			buttons: [{
				text:"确认",
				iconCls:"icon-ok",
				handler:function(){
					$("#addCoverForm").form("submit",{
						success:function(dataStr){
							var data = {};
							try{
								data = $.parseJSON(dataStr);
							}catch(e){
								console.error("json数据错误：" + e.stack);
							}
							if(data.type == "success"){
								$("#coverDialog").dialog("close");
								$("#datagridTable").datagrid("reload");
							}else{
								$.messager.alert("提示","数据提交错误");
							}
						}
					});
				}
			},{
				text:'取消',
				iconCls:"icon-cancel",
				handler:function(){
					$("#coverDialog").dialog("close");
				}
			}]
		});
		
		
		//其他事件
		var panelBody = $datagridTable.datagrid("getPanel").panel("body");
		panelBody.on("click","[data-laud]",function(){
			var $this = $(this);
			var id = $this.attr("data-laud");
			
			$("#laudDialog").dialog("open");
			$("#laudUserId").combobox("clear");
			$("#laudForm").form("clear").form("load",{id:id});
			
		});
		
		panelBody.on("click","[data-cover]",function(){
			var $this = $(this);
			var id = $this.attr("data-cover");
			$("#coverDialog").dialog("open");
			$("#addCoverForm").form("clear").form("load",{id:id});
		});
		
		
		
		$("#addBtn").click(function(){
				$("#addForm").form("clear");
				$("#addDialog").dialog({title:"添加评论"}).dialog("open");
		});
		

		$("#editBtn").click(function(){
			var rowData = $("#datagridTable").datagrid("getSelected");
			if(rowData == null){
				$.messager.alert("提示","请选择一条数据！");
				return false;
			}
			
			$("#addForm").form("clear");
			var formatRowData = util.formatData(rowData);
			$("#publishUserId").combobox("clear");
			$("#addForm").form("clear");
			$("#addForm").form("load",formatRowData);
			$("#addDialog").dialog({title:"修改评论-" + rowData.id}).dialog("open");
			
		});
		
		$("#deleteBtn").click(function(){
			var rowData = $("#datagridTable").datagrid("getSelected");
			if(rowData == null){
				$.messager.alert("提示","请选择一条数据！");
				return false;
			}
			
			$.messager.confirm("确认提示","是否删除数据:" + rowData.id, function(flag){
				if(flag){
					$.post("delete",{id:rowData.id},function(){
						$("#datagridTable").datagrid("reload");
					});
				}
				
			});
			
			
		});
	
		
		
	});
	
	
</script>
</head>

<body>
	
	<table class="easyui-datagrid" id="datagridTable">
	</table>

	<div id="toolBar">
			<a href="javascript:;" class="easyui-linkbutton" iconCls="icon-add" id="addBtn" >添加</a>
			<a href="javascript:;" class="easyui-linkbutton" iconCls="icon-edit" id="editBtn" >修改</a>
			<a href="javascript:;" class="easyui-linkbutton" iconCls="icon-remove" id="deleteBtn" >删除</a>
			<span style="padding-left:10px;background-color:#e2e2e2;">
				地址：<b id="friendStatus"></b>
			</span>
	</div>
	
	
	<div id="addDialog"  title="评论信息" >
		<form action="addOrUpdate" id="addForm" method="post" >
			<input type="hidden" name="id" />
			<table class="common-table">
				<tr>
					<td>
						类型：
					</td>
					<td>
						<input type="text" name="type"  class="easyui-combobox"  data-options="required:true,url:'${base}/comment/typeList',valueField:'value',textField:'name'" />
					</td>
				</tr>	
				<tr>
					<td>
						标题：
					</td>
					<td>
						<input name="msg.title" class="easyui-textbox"  data-options="required:true" />
					</td>
				</tr>	
				<tr>
					<td>
						消息：
					</td>
					<td>
						<textarea name="msg.content" class="common-area"></textarea>
					</td>
				</tr>	
				<tr>
					<td>
						发布时间：
					</td>
					<td>
						<input type="text" name="msg.createDate"  class="easyui-datetimebox"   />&nbsp;<span style='color:gray;'>可选</span>
					</td>
				</tr>
				<tr>
					<td>
						分享的链接：
					</td>
					<td>
						<input name="msg.shareUrl" class="common-input" />
						<a href="javascript:;" class="easyui-linkbutton" init-upload="msg.shareUrl" >上传图片</a>
						<a href="javascript:;" data-preview="msg.shareUrl">预览</a>
					</td>
				</tr>	
				<tr>
					<td>
						发布者：
					</td>
					<td>
						<input type="text" name="publishUser.id"   id="publishUserId" class="easyui-combobox" data-options="required:true,url:'${base}/user/listJson',valueField:'id',textField:'userName'" />
					</td>
				</tr>	
			</table>
		</form>
	</div>
	
	
	
	<div id="laudDialog"  title="点赞" >
		<form action="addLaudUser" id="laudForm" method="post" >
			<table class="common-table">
				<tr>
					<td>
						编号：
					</td>
					<td>
						<input type="text" name="id"  readonly="readonly"  />
					</td>
				</tr>	
				<tr>
					<td>
						点赞者：
					</td>
					<td>
						<input type="text" name="userId"  id="laudUserId" class="easyui-combobox" data-options="required:true,url:'${base}/user/listJson',valueField:'id',textField:'userName',multiple:true" />
					</td>
				</tr>	
				<tr>
					<td>
						清空原有点赞：
					</td>
					<td>
						<input type="checkbox" name="isClear"  value="true"/>
					</td>
				</tr>
			</table>
		</form>
	</div>
	
	
	
	<div id="coverDialog"  title="评论" >
		<form action="addCoverComment" id="addCoverForm" method="post" >
			<table class="common-table">
				<tr>
					<td>
						编号：
					</td>
					<td>
						<input type="text" name="id"  readonly="readonly"  />
					</td>
				</tr>	
				<tr>
					<td>
						评论者：
					</td>
					<td>
						<input type="text" name="userId"   class="easyui-combobox" data-options="required:true,url:'${base}/user/listJson',valueField:'id',textField:'userName'" />
					</td>
				</tr>	
				<tr>
					<td>
						评论信息：
					</td>
					<td>
						<textarea name="content"  class="common-area"></textarea>
					</td>
				</tr>
			</table>
		</form>
	</div>
	
	
</body>	
</html>