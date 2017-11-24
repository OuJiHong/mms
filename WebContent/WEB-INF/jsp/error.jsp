<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>错误页面</title>
</head>
<body>

	<div style="background-color:white;border:solid 1px #dedede;padding:20px;">
		<div style="color:red;text-align:center;font-size:60px;line-height:1.4;" >
			500
		</div>
		<div>
			错误详情：
			<p>
				<b style="color:red">${exception.message}</b>
			</p>
		</div>	
	</div>
	
	
</body>
</html>