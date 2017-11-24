package com.tmp.dao.impl;

import java.util.List;

import javax.persistence.FlushModeType;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import com.tmp.dao.CommentDao;
import com.tmp.entity.Comment;

/**
 * @author Administrator
 *
 */
@Repository("commentDaoImpl")
public class CommentDaoImpl extends BaseDaoImpl<Comment,Long> implements CommentDao{

	@Override
	public List<Comment> listPublish() {
		String jpql = "select comment from Comment comment where type = :type";
		TypedQuery<Comment> typedQuery = entityManager.createQuery(jpql,Comment.class);
		return typedQuery.setParameter("type", Comment.Type.publish).setFlushMode(FlushModeType.COMMIT).getResultList();
	}
	

}
