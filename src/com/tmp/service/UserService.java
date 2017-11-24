package com.tmp.service;

import org.springframework.security.core.userdetails.UserDetails;

import com.tmp.entity.User;



/**
 * 用户信息管理
 * @author Administrator
 *
 */
public interface UserService extends BaseService<User,Long>{

	/**
	 * 获取当前用户
	 * @return
	 */
	public UserDetails currentUser();
	
}
