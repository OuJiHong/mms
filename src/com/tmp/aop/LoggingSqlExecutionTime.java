package com.tmp.aop;

import java.lang.reflect.Method;
import java.util.Date;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.aop.MethodBeforeAdvice;

/**
 * 测试sql执行时间
 * 
 * @author Administrator
 *
 */
public class LoggingSqlExecutionTime implements MethodBeforeAdvice, MethodInterceptor{

	private static Log log = LogFactory.getLog(LoggingSqlExecutionTime.class);
	
	@Override
	public void before(Method method, Object[] args, Object target)
			throws Throwable {
		log.info("开始执行sql方法：" + target.getClass().getName() + ">>" + method.getName());
	}

	@Override
	public Object invoke(MethodInvocation invocation) throws Throwable {
		Date startTime = new Date();
		Object result = invocation.proceed();
		Date endTime = new Date();
		
		long offset = endTime.getTime() - startTime.getTime();
		//如果执行时间过久，可记录关键信息
		log.info("方法：" + invocation.getThis().getClass().getName() + "." + invocation.getMethod().getName() + "执行时间：" + offset);
		return result;
	}


}
