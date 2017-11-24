package com.tmp.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tmp.dao.CommentDao;
import com.tmp.entity.Comment;
import com.tmp.service.CommentService;

@Service("commentServiceImpl")
public class CommentServiceImpl extends BaseServiceImpl<Comment,Long> implements CommentService{
	
	@Resource(name="commentDaoImpl")
	private CommentDao commentDao;
	
	@Resource(name="commentDaoImpl")
	public void setBaseDao(CommentDao comnentDao){
		super.setBaseDao(comnentDao);
	}

	@Override
	@Transactional(readOnly=true)
	public List<Comment> listPublish() {
		return commentDao.listPublish();
	}
	
}
