package com.tmp.dao.impl;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import com.tmp.dao.UserDao;
import com.tmp.entity.User;

/**
 * @author Administrator
 *
 */
@Repository("userDaoImpl")
public class UserDaoImpl extends BaseDaoImpl<User,Long> implements UserDao{
	


}
