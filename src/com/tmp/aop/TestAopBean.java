package com.tmp.aop;

import java.lang.reflect.Method;

import org.springframework.aop.AfterReturningAdvice;
import org.springframework.aop.MethodBeforeAdvice;

/**
 * 测试aop通知
 * @author Administrator
 *
 */
public class TestAopBean implements MethodBeforeAdvice,AfterReturningAdvice{

	@Override
	public void before(Method method, Object[] args, Object target)
			throws Throwable {
		System.out.println("===============执行方法：" + method.getName() + ",开始时间：" + System.currentTimeMillis());
		
	}

	@Override
	public void afterReturning(Object returnValue, Method method,
			Object[] args, Object target) throws Throwable {
		System.out.println("===============执行方法：" + method.getName() + ",结束时间：" + System.currentTimeMillis());		
	}

}
