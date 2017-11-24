package com.tmp.controller;

import java.awt.image.BufferedImage;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.WebAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tmp.service.CaptchaService;

/**
 * 入口
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/")
public class IndexController extends BaseController {
	
	@Autowired
	private CaptchaService captchService;
	
	@RequestMapping(value={"/", "/index"})
	public String index(){
		return  "/index";
	}
	
	
	@RequestMapping("/sysInfo")
	public String sysInfo(){
		return "/sysInfo";
		
	}
	
	
	/**
	 * 获取验证码
	 * @return
	 */
	@RequestMapping("/captcha")
	@ResponseBody
	public BufferedImage captcha(){
		return captchService.generateCaptcha();
	}
	
	
	
	@RequestMapping("/loginPage")
	public String loginPage(HttpServletRequest request){
		HttpSession session = request.getSession();
		AuthenticationException authenticationException  =(AuthenticationException)session.getAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		if(authenticationException != null && authenticationException.getAuthentication() != null){
			Object principal = authenticationException.getAuthentication().getPrincipal();
			if(principal instanceof UserDetails){
				request.setAttribute("username", ((UserDetails) principal).getUsername());
			}else{
				request.setAttribute("username", principal);
			}
		}
		request.setAttribute("exception", authenticationException);
		session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		return "/loginPage";
	}
	
}
