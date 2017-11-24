package com.tmp.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 评论
 * 
 * @author Administrator
 *
 */
@Entity
@Table(name="comment")
public class Comment extends BaseEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public enum Type{
		//发表
		publish,
		//评论
		comment
	}
	
	
	private Type type;
	
	private Msg msg;
	
	private User publishUser;
	
	/**
	 * “赞”的人,可以重复评论，但不能重复点赞
	 */
	private Set<User> laudUsers = new HashSet<User>();
	
	/**
	 * 针对的评论
	 */
	private Comment pertinenceComment;
	
	/**
	 * 
	 * 涉及的评论信息
	 * 
	 */
	private List<Comment> coverComments = new ArrayList<Comment>();

	@JsonProperty
	@Column(name="type")
	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	@JsonProperty
	@OneToOne(fetch=FetchType.EAGER,cascade=CascadeType.ALL)
	@JoinColumn(name="msg")
	public Msg getMsg() {
		return msg;
	}

	public void setMsg(Msg msg) {
		this.msg = msg;
	}
	
	@JsonProperty
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="publish_user")
	public User getPublishUser() {
		return publishUser;
	}

	public void setPublishUser(User publishUser) {
		this.publishUser = publishUser;
	}
	
	@JsonProperty
	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable(name="comment_laud_user", joinColumns=@JoinColumn(name="comment"), inverseJoinColumns=@JoinColumn(name="user"))
	public Set<User> getLaudUsers() {
		return laudUsers;
	}

	public void setLaudUsers(Set<User> laudUsers) {
		this.laudUsers = laudUsers;
	}
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="pertinence_comment")
	public Comment getPertinenceComment() {
		return pertinenceComment;
	}

	public void setPertinenceComment(Comment pertinenceComment) {
		this.pertinenceComment = pertinenceComment;
	}
	
	@JsonProperty
	@OneToMany(mappedBy="pertinenceComment", fetch=FetchType.LAZY)
	public List<Comment> getCoverComments() {
		return coverComments;
	}

	public void setCoverComments(List<Comment> coverComments) {
		this.coverComments = coverComments;
	}




	
	
}
