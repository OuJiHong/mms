package com.tmp.util;

import javax.servlet.ServletContext;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ServletContextAware;

/**
 * 工具
 * 
 * @author Administrator
 *
 */
@Component
public class SpringUtils implements ApplicationContextAware{
	
	/**
	 * 私有
	 */
	private static ApplicationContext applicationContext;
	
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		SpringUtils.applicationContext = applicationContext;
	}
	
	
	/**
	 * 获取上下文环境
	 * @return
	 */
	public static ApplicationContext getApplicationContext(){
		if(SpringUtils.applicationContext == null){
			throw new IllegalStateException("上下文对象applicationContext 尚未初始化");
		}
		return SpringUtils.applicationContext;
	}
	
	/**
	 * 获取国际化资源
	 * @param code
	 * @param args
	 * @return
	 */
	public static String getMessage(String code, Object... args){
		String message = getApplicationContext().getMessage(code, args, LocaleContextHolder.getLocale());
		if(message == null){
			message = code;
		}
		return message;
	}
	

}
