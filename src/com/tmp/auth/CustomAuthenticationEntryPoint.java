package com.tmp.auth;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;

/**
 * 登录认证入口
 * @author OJH
 *
 */
public class CustomAuthenticationEntryPoint extends LoginUrlAuthenticationEntryPoint{
	
	
	/**
	 * 推荐使用
	 * @param loginFormUrl
	 */
	public CustomAuthenticationEntryPoint(String loginFormUrl) {
		super(loginFormUrl);
	}

	@Override
	protected String determineUrlToUseForThisRequest(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) {
		//可自定义其他代码
		return super.determineUrlToUseForThisRequest(request, response, exception);
	}
	
}
