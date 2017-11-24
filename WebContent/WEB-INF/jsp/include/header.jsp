<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	request.setAttribute("base", request.getContextPath());
%>
<script type="text/javascript">
	window.onerror = function(msg ,url ,line){
		 window.alert("出现错误：" + "msg=" + msg + ",\r\nurl=" + url + ",\r\nline=" + line);
		 return false;
	}

	window.settings = {
		base:"${base}",
		localAddress:"http://<%=java.net.InetAddress.getLocalHost().getHostAddress() %>:<%=request.getLocalPort() %>${base}"
	};
	
</script>

<link rel="stylesheet" type="text/css" href="${base}/resources/jquery-easyui-1.5/themes/default/easyui.css" />
<link rel="stylesheet" type="text/css" href="${base}/resources/jquery-easyui-1.5/themes/color.css" />
<link rel="stylesheet" type="text/css" href="${base}/resources/jquery-easyui-1.5/themes/icon.css" />
<link rel="stylesheet" type="text/css" href="${base}/resources/css/common.css" />

<script type="text/javascript"  src="${base}/resources/js/screenfull.min.js" > </script>
<script type="text/javascript"  src="${base}/resources/js/jquery-1.8.3.min.js" > </script>
<script type="text/javascript"  src="${base}/resources/js/jquery.tap.js" > </script>
<script type="text/javascript"  src="${base}/resources/jquery-easyui-1.5/jquery.easyui.min.js" > </script>
<script type="text/javascript"  src="${base}/resources/jquery-easyui-1.5/locale/easyui-lang-zh_CN.js" > </script>
<script type="text/javascript"  src="${base}/resources/js/iscroll.js" > </script>
<script type="text/javascript"  src="${base}/resources/js/template.js" > </script>
<script type="text/javascript"  src="${base}/resources/js/common.js" > </script>
