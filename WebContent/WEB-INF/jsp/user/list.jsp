<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="/WEB-INF/jsp/include/header.jsp" %>

<title>用户列表</title>

<script type="text/javascript">
	
	$(function(){
		
		$("#datagridTable").datagrid({
			url:"listJson",
			columns:[[
			          {field:"id",title:"编号",width:80},
			          {field:"image",title:"头像",width:80,formatter:function(value){
			        	  return "<img src='"+value+"' class='common-limit-img' alt='"+value+"'/>";
			          }},
			          {field:"bgImage",title:"背景",width:100,formatter:function(value){
			        	  return "<img src='"+value+"' class='common-limit-img' alt='"+value+"'/>";
			          }},
			          {field:"userName",title:"用户名",width:100},
			          {field:"password",title:"密码",width:80},
			          {field:"createDate",title:"创建时间",width:80},
			          {field:"modifyDate",title:"修改时间",width:80}
			]],
			method:"get",
			border:false,
			singleSelect:true,
			fit:true,
			fitColumns:true,
			toolbar:"#toolBar"
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
								$.messager.alert("提示", data.content);
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
		
		
		
		
		
		
		$("#addBtn").click(function(){
				$("#addForm").form("clear");
				$("#addDialog").dialog({title:"添加用户"}).dialog("open");
		});
		

		$("#editBtn").click(function(){
			var rowData = $("#datagridTable").datagrid("getSelected");
			if(rowData == null){
				$.messager.alert("提示","请选择一条数据！");
				return false;
			}
			
			$("#addForm").form("clear");
			$("#addForm").form("load",rowData);
			$("#addDialog").dialog({title:"修改用户-" + rowData.id}).dialog("open");
			
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
	</div>
	
	
	<div id="addDialog"  title="用户信息" >
		<form action="addOrUpdate" id="addForm" method="post" >
			<input type="hidden" name="id" />
			<table>
				<tr>
					<td>
						姓名：
					</td>
					<td>
						<input type="text" name="userName"  class="easyui-textbox" data-options="required:true"/>
					</td>
				</tr>	
				<tr>
					<td>
						头像：
					</td>
					<td>
						<input type="text" name="image"  class="common-input"/>
						<a href="javascript:;" class="easyui-linkbutton" init-upload="image" >上传</a>
					</td>
				</tr>	
				<tr>
					<td>
						背景：
					</td>
					<td>
						<input type="text" name="bgImage"  class="common-input"/>
						<a href="javascript:;" class="easyui-linkbutton" init-upload="bgImage">上传</a>
					</td>
				</tr>	
				<tr>
					<td>
						密码：
					</td>
					<td>
						<input type="text" name="password" class="easyui-textbox"/>
					</td>
				</tr>	
			</table>
		</form>
	</div>
</body>	
</html>