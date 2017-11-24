package com.tmp.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.transaction.annotation.Transactional;

import com.tmp.dao.BaseDao;
import com.tmp.service.BaseService;

/**
 * 基础服务实现
 * 
 * @author Administrator
 *
 * @param <T>
 * @param <L>
 */
@Transactional
public abstract class BaseServiceImpl<T,L> implements BaseService<T, L>{
	
	private  BaseDao<T, L>  baseDao;
	
	@Required
	protected void setBaseDao(BaseDao<T, L> baseDao){
		this.baseDao = baseDao;
	}
	
	@Override
	public void add(T entity) {
		baseDao.add(entity);
	}

	@Override
	public void update(T entity) {
		baseDao.update(entity);
	}
	
	@Override
	public void delete(T entity) {
		L id = baseDao.getPrimaryId(entity);
		T existEntity = baseDao.find(id);
		if(existEntity != null){
			baseDao.delete(existEntity);
		}
	}
	
	@Override
	public T find(L id) {
		return baseDao.find(id);
	}

	@Override
	public List<T> findList(L... ids){
		return baseDao.findList(ids);
	}
	
	@Override
	@Transactional(readOnly=true)
	public List<T> list() {
		return baseDao.list();
	}

}
