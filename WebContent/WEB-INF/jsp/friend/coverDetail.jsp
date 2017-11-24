<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  <%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
  <%@ taglib prefix="fmt"  uri="http://java.sun.com/jsp/jstl/fmt" %>
 <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
 
<c:forEach var="cover"  items="${coverComments}">
 	<div class="cover-reply">
 		<img src="${base}/resources/images/dialogIcon.png" class="cover-icon" />
 		<div class="cover-wrap clearfix">
 			<table class="cover-table">
 				<tr>
 					<td>
 						<img src="${cover.publishUser.image}"  class="likeImage" />
 					</td>
 					<td>
 						<div class="cover-line">
				 			<span class="cover-left">${cover.publishUser.userName}</span>
				 			<span class="cover-right"><fmt:formatDate value="${cover.createDate }" pattern="yyyy年MM月dd日   HH:mm" /></span>
					 		<c:if test="${replyName != null }">
					 			回复<span>${replyName}</span>
					 		</c:if>
				 		</div>
				 		<div class="cover-line">
				 			${cover.msg.content}
				 		</div>
				 		
 					</td>
 				</tr>
 			</table>
 		</div>
 	</div>
 	<c:if test="${fn:length(coverComments) gt 0 }">
 		<c:set var="coverComments" value="${cover.coverComments }" scope="request" />
 		<c:set var="replyName" value="${cover.publishUser.userName }" scope="request" />
 		<c:import url="coverDetail.jsp" />
	</c:if>
 </c:forEach>
 