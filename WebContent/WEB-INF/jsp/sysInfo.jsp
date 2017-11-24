<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title> 系统信息</title>
</head>
<body>
	<h4>系统信息</h4>
	<div>项目环境路径：${rc.contextPath }</div>
	<div>请求路径：${rc.requestUri}</div>
	<div>获取的参数：${param }</div>
</body>
</html>