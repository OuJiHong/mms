<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="/WEB-INF/jsp/include/header.jsp" %>
<title>登录页面</title>

<style>
	.captcha{
		vertical-align:middle;
		cursor:pointer;
	}
	
	.login-table{
		width:400px;
		margin:20px auto;
		border-collapse:collapse;
	}
	
	.login-table  td{
		backgrund-color:#889922;
		border:solid 1px #eee;
		padding-left:8px;
		line-height:34px;
	}
	
	
</style>

<script>
	$(function(){
		$("#captcha").click(function(){
			var url = "${base}/captcha";
			$(this).attr("src", url + "?_t=" + new Date().getTime());
		});
		
		var errorMsg = "${exception != null ? exception.message : ''}";
		if(errorMsg != ""){
			$.messager.alert("提示信息", errorMsg, "error");
		}
		
	});
	
</script>
</head>
<body >
	<div class="easyui-panel" title="用户登录">
		
		<form action="loginSubmit" method="post">
			<table class="login-table">
				<tr>
					<td>
						用户名：
					</td>
					<td>
						<input type="text" name="username" value="${username}"  placeholder="请输入用户名"/>
					</td>
				</tr>	
				<tr>
					<td>
						密码：
					</td>
					<td>
						<input type="password" name="password"  placeholder="请输入密码"/>
					</td>
				</tr>	
				<tr>
					<td>
						验证码：
					</td>
					<td>
						<input type="text" name="captcha" placeholder="请输入验证码"/>
						<img src="${base}/captcha"  class="captcha" id="captcha" />
					</td>
				</tr>	
				<tr>
					<td colspan="2" style="text-align:center;">
						<button type="submit">登录</button>
					</td>
				</tr>	
			</table>
		</form>
	</div>
</body>
</html>