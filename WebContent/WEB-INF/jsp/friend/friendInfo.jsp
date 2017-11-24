<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
   
 <%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
 <%@ taglib prefix="fmt"  uri="http://java.sun.com/jsp/jstl/fmt" %>
 <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
 
<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>我的朋友圈</title>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    
    <%@include file="/WEB-INF/jsp/include/header.jsp" %>
    
    <link href="${base}/resources/css/friend.css" rel="stylesheet">
    
    
    <script type="text/javascript">
    	
    $(function(){
    	
    	/* $.ajax({
    		url:"detail",
    		data:{id:"${comment.id}"},
    		success:function(data){
    			$("#detailTemplate").template(data);
    		},
    		error:function(){
    			$.messager.alert("提示信息","数据加载失败");
    		}
    	}); */
    	
    	var $main = $("#main");
    	$main.css({overflow:"hidden"});
    	
    	var mainScroll = new IScroll("#main",{
    		mouseWheel:true
    	});
    	
    	$(window).resize(function(){
    		var maxHeight = $(window).height() - $("header").outerHeight();
    		$main.height(maxHeight);
    		mainScroll.refresh();
    	});
    	
    	setTimeout(function(){
    		$(window).resize();	
    	});
    	
    	$("img").load(function(){
    		$(window).resize();
    	});
    	
    	$("[change-back]").on("tap", function(){
    		window.history.back();
    	});
    	
    	$("[change-full]").on("tap", function(){
    		screenfull.toggle(document.body);
    	});
    	
    	$("[change-url]").on("tap", function(){
    		var $this = $(this);
    		var url = $this.attr("change-url");
    		window.location.href = url;
    	});
    	
    	
    });
    
     
    </script>
    
</head>

<body>
    <header>
    	<div class="data-top"></div>
    	<div class="data-title clearfix">
    		<div class="data-title-line">
	    		<span class="data-title-leftIcon" change-back ></span>
	    		<span class="data-title-text">朋友圈</span>
	    		<span class="data-title-photo" change-full ></span>
    		</div>
    	</div>
    </header>
	<section id="main">
		 <div class="clearfix">
		 	<div class="data-user-wrapper">
		 		 <div class="data-bg" style="background-image:url('${user.bgImage}')">
		        	&nbsp;
		        </div>
		        <p id="user-name" class="data-name">${user.userName}</p>
		        <a href="#">
		        	<img id="avt" class="data-avt" src="${user.image}">
		        </a>
		 	</div>
	        <div id="list">
				<ul>
					  <!--  数据模版	 -->
					  <c:forEach var="item"  items="${commentList}" varStatus="status">
			            <li class="list-item" change-url="${base}/comment/friendDetail?id=${item.id}"  id="listPos_${status.index}">
			                <div class="po-avt-wrap">
			                    <img class="po-avt" src="${item.publishUser.image }" />
			                </div>
			                <div class="po-cmt" >
			                    <div class="po-hd">
			                        <div class="po-name">${item.publishUser.userName}</div>
			                        <div class="post">
			                        	${item.msg.title}
			                        </div>
			                        <div class="post">
										<c:choose>
											<c:when test="${item.msg.shareUrl != null && item.msg.shareUrl != '' }">
												<div class="share-link">
												<table class="share-table">
													<tr>
														<td>
															<img class="responsive" src="${item.msg.shareUrl}" /> 
														</td>
														<td>
															<div class="share-content">${item.msg.content}</div>
														</td>
													</tr>
												</table>
												</div>
											</c:when>
											<c:otherwise>
												${item.msg.content}
											</c:otherwise>
										</c:choose>
									</div>
			                        <div class="time">
			                       		 ${item.msg.listDiffDateStr} 
			                        </div>
			                        
			                        <a href="javascript:;" class="c-icon">
										<img class="responsive" src="${base}/resources/images/2_c.png">
									</a>
			                    </div>
			                    
			                    <c:if test="${fn:length(item.laudUsers) gt 0 || fn:length(item.coverComments) gt 0 }">
			                    <div class="r"></div>
			                    <div class="cmt-wrap">
			                    
			                    	<c:if test="${fn:length(item.laudUsers) gt 0 }">
			                        <div class="like">
										<img src="${base}/resources/images/3_l.png" class="like-icon">
										<!--  点赞的人 -->
										<c:forEach var="laudUser" items="${item.laudUsers }" varStatus="status">
											<c:if test="${status.index gt 0 }">
												,
											</c:if>
											${laudUser.userName}
										</c:forEach>
										<span class="data-name"></span>
									</div>
									</c:if>
									
									<c:if test="${fn:length(item.coverComments) gt 0 }">
			                        <div class="cmt-list">
			                        	<!--  评论的人	 -->
			                        	<c:set var="coverComments" value="${item.coverComments}" scope="request" />
			                        	<c:import url="cover.jsp" /> 
			                        </div>
			                        </c:if>
			                        
			                    </div>
			                    </c:if>
			                </div>
			            </li>
			          </c:forEach>
					<!--  end  -->
				</ul>
	        </div>
	    </div>
	</section>
    
  
</body>


</html>