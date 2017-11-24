package com.tmp.service.impl;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.tmp.dao.UserDao;
import com.tmp.entity.User;
import com.tmp.service.UserService;

/**
 * 用户服务实现
 * @author Administrator
 *
 */
@Service("userServiceImpl")
public class UserServiceImpl extends BaseServiceImpl<User,Long> implements UserService{
	
	/**
	 * 用户目录，从系统变量获取
	 */
	@Value("${user.home}")
	private String userPath;
	
	@Resource(name="userDaoImpl")
	private UserDao userDao;
	
	@Value("#{systemProperties['java.version']}")
	private String javaVersion;
	
	
	@Resource(name="userDaoImpl")
	public void setBaseDao(UserDao userDao){
		super.setBaseDao(userDao);
	}
	
	
	
	/* (non-Javadoc)
	 * @see com.tmp.service.UserService#currentUser()
	 */
	@Override
	public UserDetails currentUser(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Object principal = authentication.getPrincipal();
		if(principal instanceof UserDetails){
			return (UserDetails)principal;
		}
		return null;
	} 

	
	
}
