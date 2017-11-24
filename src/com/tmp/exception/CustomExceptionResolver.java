package com.tmp.exception;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;

import com.tmp.form.TransMessage;
import com.tmp.util.JsonUtil;
import com.tmp.util.SpringUtils;

/**
 * 自定义异常解析
 * @author OJH
 *
 */
public class CustomExceptionResolver extends SimpleMappingExceptionResolver{
	
	@Override
	protected ModelAndView doResolveException(HttpServletRequest request, HttpServletResponse response, Object handler,
			Exception ex) {
		
		boolean isWriteJson = false;
		if(handler instanceof HandlerMethod){
			HandlerMethod handlerMethod = (HandlerMethod)handler;
			ResponseBody responseBody = handlerMethod.getMethodAnnotation(ResponseBody.class);
			if(responseBody != null){
				isWriteJson = true;
			}
			
		}
		
		TransMessage message = TransMessage.error(ex.getMessage());
		
		if(ex instanceof BindException){
			BindException bindException = (BindException)ex;
			List<FieldError> fieldErrors =  bindException.getFieldErrors();
			FieldError fieldError = fieldErrors.get(0);
			message.setContent("字段" + fieldError.getField() + ":" + fieldError.getDefaultMessage());
		}else if(ex instanceof BizException){
			BizException bindException = (BizException)ex;
			String msg = bindException.getMessage();
			message.setContent(SpringUtils.getMessage(msg));
		}
		
		if(isWriteJson){
			JsonUtil.responseJson(response, message);
			return new ModelAndView();
		}
		
		//default
		return super.doResolveException(request, response, handler, ex);
	}
	
	
}
