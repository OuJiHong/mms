package com.tmp.dao;

import java.util.List;

import com.tmp.entity.Comment;

/**
 * 
 * @author Administrator
 *
 */
public interface CommentDao extends BaseDao<Comment,Long>{
	
	public List<Comment> listPublish();
	
}
