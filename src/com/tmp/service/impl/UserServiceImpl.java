package com.tmp.service.impl;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tmp.dao.BaseDao;
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
	
	public String getUserPath() {
		return userPath;
	}

	public void setUserPath(String userPath) {
		this.userPath = userPath;
	}


	public UserDao getUserDao() {
		return userDao;
	}


	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}


	
}
