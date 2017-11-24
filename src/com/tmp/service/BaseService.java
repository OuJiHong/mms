package com.tmp.service;

import java.util.List;

/**
 * 基础服务
 * 
 * @author Administrator
 *
 */
public interface BaseService<T,L> {

	/**
	 * 添加数据
	 * @param entity
	 */
	public void add(T entity);
	
	/**
	 * 更新数据
	 * @param entity
	 */
	public void update(T entity);
	
	/**
	 * 删除数据
	 * @param entity
	 */
	public void delete(T entity);
	
	/**
	 * 查询数据
	 * @param id
	 * @return
	 */
	public T find(L id);
	
	/**
	 * 查找一个集合
	 * @param ids
	 * @return
	 */
	public List<T> findList(L... ids);
	
	/**
	 * 列出所有数据
	 * @return
	 */
	public List<T> list();
	
}
