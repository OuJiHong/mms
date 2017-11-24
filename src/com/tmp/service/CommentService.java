package com.tmp.service;

import java.util.List;

import com.tmp.entity.Comment;

public interface CommentService extends BaseService<Comment,Long> {
	
	/**
	 * 只显示发表的内容
	 * @return
	 */
	public List<Comment> listPublish();
	
}
