package com.tmp.aop;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

/**
 * jdk 代理
 * @author Administrator
 *
 */
public class InvokeProxyHandler implements InvocationHandler {
	
	//目标对象
	private Object target;
	

	public InvokeProxyHandler(Object target) {
		super();
		this.target = target;
	}



	/* (non-Javadoc)
	 * @see java.lang.reflect.InvocationHandler#invoke(java.lang.Object, java.lang.reflect.Method, java.lang.Object[])
	 * 
	 * 代理接口的所有方法都会通过invoke来调用，仅仅传入了方法信息
	 */
	@Override
	public Object invoke(Object proxy, Method m, Object[] args)
			throws Throwable {
		//proxy是jdk生成的代理对象，而声明的成员target是实际的目标对象
		System.out.println(proxy.getClass() + "开始时间:" + System.currentTimeMillis());
		Object result = m.invoke(target, args);
		System.out.println(proxy.getClass() + "结束时间：" + System.currentTimeMillis());
		return result;
	}
	
}
