package com.tmp.service;

import java.awt.image.BufferedImage;

import javax.servlet.http.HttpServletRequest;

/**
 * 验证码服务
 * @author OJH
 *
 */
public interface CaptchaService {
	
	
	/**
	 * 生成验证码
	 * @return
	 */
	BufferedImage generateCaptcha();
	
	
	/**
	 * 验证码是否有效
	 * @param captcha
	 * @return
	 */
	boolean isValid(HttpServletRequest request, String captcha);
	
}
