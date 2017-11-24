package com.tmp.util;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * json序列化
 * 
 * @author Administrator
 *
 */
public class JsonUtil {
	
	private static Log logger = LogFactory.getLog(JsonUtil.class);
	
	private static ObjectMapper objectMapper = new ObjectMapper();
	
	static{
		//nothing
		
	}
	
	/**
	 * 转换成json
	 * @param value
	 * @return
	 */
	public static String toJson(Object value){
		try {
			return objectMapper.writeValueAsString(value);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	
	/**
	 * 读取json
	 * @param jsonStr
	 * @param clazz
	 * @return
	 */
	public static <T> T readValue(String content, Class<T> valueType){
		try {
			return objectMapper.readValue(content, valueType);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	
	/**
	 * 响应json数据
	 * @param response
	 * @param value
	 */
	public static void responseJson(HttpServletResponse response, Object value){
		try {
			response.setContentType("application/json;charset=UTF-8");
			response.getWriter().write(toJson(value));
			response.flushBuffer();
		} catch (IOException e) {
			logger.error("响应json数据失败", e);
		}
		
	}
	
}
