package com.tmp.dao.impl;

import java.lang.reflect.ParameterizedType;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.FlushModeType;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.tmp.dao.BaseDao;

/**
 * 基础实现
 * 
 * @author Administrator
 *
 */
public abstract class BaseDaoImpl<T,L> implements BaseDao<T,L> {
	
	
	@PersistenceContext
	protected EntityManager entityManager;
	
	private Class<?>  entityClass;
	
	private static Log log = LogFactory.getLog(BaseDaoImpl.class);
	
	public BaseDaoImpl() {
		entityClass = (Class<?>)((ParameterizedType)this.getClass().getGenericSuperclass()).getActualTypeArguments()[0];
		log.debug("初始化实体类:" + entityClass);
	}
	
	@Override
	public L getPrimaryId(T entity) {
		return (L)entityManager.getEntityManagerFactory().getPersistenceUnitUtil().getIdentifier(entity);
	}
	
	@Override
	public void add(T entity) {
		entityManager.persist(entity);
	}

	@Override
	public void update(T entity) {
		entityManager.merge(entity);
	}
	
	@Override
	public void delete(T entity) {
		entityManager.remove(entity);
	}
	
	@Override
	public T find(L id) {
		return (T)entityManager.find(entityClass, id);
	}
	
	@Override
	public List<T> findList(L[] ids){
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<T> criteriaQuery =  (CriteriaQuery<T>)builder.createQuery(entityClass);
		Root<T> root = (Root<T>)criteriaQuery.from(entityClass);
		criteriaQuery.select(root);
		criteriaQuery.where(root.in(ids));
		
		TypedQuery<T> typedQuery = entityManager.createQuery(criteriaQuery);
		return typedQuery.setFlushMode(FlushModeType.COMMIT).getResultList();
	}
	
	@Override
	public List<T> list() {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<T> criteriaQuery =  (CriteriaQuery<T>)builder.createQuery(entityClass);
		Root<T> root = (Root<T>)criteriaQuery.from(entityClass);
		criteriaQuery.select(root);
		
		TypedQuery<T> typedQuery = entityManager.createQuery(criteriaQuery);
		return typedQuery.setFlushMode(FlushModeType.COMMIT).getResultList();
	}

}
