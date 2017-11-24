<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  <%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
  <%@ taglib prefix="fmt"  uri="http://java.sun.com/jsp/jstl/fmt" %>
 <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
 
<c:forEach var="cover"  items="${coverComments}">
 	<p>
 		<span class="data-name">${cover.publishUser.userName}</span>
 		<c:if test="${replyName != null }">
 			回复<span>${replyName}</span>
 		</c:if>
 		<span>:</span>${cover.msg.content}
 	</p>
 	<c:if test="${fn:length(coverComments) gt 0 }">
 		<c:set var="coverComments" value="${cover.coverComments }" scope="request" />
 		<c:set var="replyName" value="${cover.publishUser.userName }" scope="request" />
 		<c:import url="cover.jsp" />
 	</c:if>
 </c:forEach>
 