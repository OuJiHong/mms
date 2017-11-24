<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
     <%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
 <%@ taglib prefix="fmt"  uri="http://java.sun.com/jsp/jstl/fmt" %>
 <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
 
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>详情</title>
    
    <%@include file="/WEB-INF/jsp/include/header.jsp" %>
    
    <link href="${base}/resources/css/friend.css" rel="stylesheet">
    
    <script type="text/javascript">
    	$(function(){
    		
        	$("[change-full]").on("tap", function(){
        		screenfull.toggle(document.body);
        	});
        	
        	
    	});
    	
    </script>
</head>
<body>
	
    <header>
    	<div class="data-top"></div>
    	<div class="data-title clearfix">
    		<div class="data-title-line">
	    		<span class="data-title-leftIcon" onclick="window.history.back();" ></span>
	    		<span class="data-title-text" change-full >详情</span>
    		</div>
    	</div>
    </header>
    
	 <section id="main">
		<div class="item-wrap">
			<div class="po-avt-wrap">
				<img class="po-avt" src="${comment.publishUser.image }">
			</div>
			<div class="po-cmt">
				<div class="po-hd">
					<div class="po-name">${comment.publishUser.userName}</div>
					<div class="post">
						<c:choose>
							<c:when test="${comment.msg.shareUrl != null && comment.msg.shareUrl != '' }">
								<div class="share-link">
								<table class="share-table">
									<tr>
										<td><img class="responsive" src="${comment.msg.shareUrl}" />
										</td>
										<td>
											<div class="share-content">${comment.msg.content}</div>
										</td>
									</tr>
								</table>
								</div>
							</c:when>
							<c:otherwise>
								${comment.msg.content}
							</c:otherwise>
						</c:choose>
					</div>
					<div class="time">${comment.msg.detailDiffDateStr}&nbsp;<a href="#" >删除</a></div>
					<a href="javascript:;" class="c-icon"> 
						<img class="responsive" src="${base}/resources/images/2_c.png">
					</a>
				</div>
			</div>
			
			<!--  点赞信息   -->
			<div class="detail-wrap">
			<c:if test="${fn:length(comment.laudUsers) gt 0 || fn:length(comment.coverComments) gt 0 }">
				<div class="r"></div>
				<div class="cmt-wrap">
					<c:if test="${fn:length(comment.laudUsers) gt 0 }">
						<div class="like-detail">
							<img src="${base}/resources/images/3_l.png" class="like-detail-icon" />
							<!--  点赞的人 -->
							<div class="like-detail-img">
								<c:forEach var="laudUser" items="${comment.laudUsers }" varStatus="status">
									<img src="${laudUser.image}" class="likeImage"/>
								</c:forEach>
							</div>
							<span class="data-name"></span>
						</div>
						
						<c:if test="${fn:length(comment.coverComments) gt 0 }">
							<!--  评论的人	 -->
							<c:set var="coverComments" value="${comment.coverComments}" scope="request" />
							<c:import url="coverDetail.jsp" />
						</c:if>
						
					</c:if>
				</div>
			</c:if>
			</div>
		</div>
		
		<div class="detail-footer">
			<div class="clearfix">
				<input type="text" class="detail-input" placeholder="评论" />
			    <div class="detail-btnGroup">
					<span class="detail-icon"></span>
					<a href="javascript:;" class="detail-btn">发送</a>
				</div>
			</div>
		</div>
	</section>
	
</body>
</html>