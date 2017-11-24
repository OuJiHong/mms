package com.tmp.dao;

import java.util.List;

/**
 * 基础方法
 * 
 * @author Administrator
 *
 */
public interface BaseDao<T,L> {
	
	/**
	 * 获取主键
	 * @param entity
	 * @return
	 */
	public L getPrimaryId(T entity);
	
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
	 * 查找集合
	 * @param ids
	 * @return
	 */
	public List<T> findList(L[] ids);
	
	/**
	 * 列出所有数据
	 * @return
	 */
	public List<T> list();
	
}
