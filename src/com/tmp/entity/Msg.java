package com.tmp.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 信息
 * @author Administrator
 *
 */
@Entity
@Table(name="msg")
public class Msg extends BaseEntity{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5252134876889983745L;

	private String title;
	
	private String shareUrl;
	
	private String content;
	
	private Comment comment;
	
	@JsonProperty
	@Column(name="title")
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	
	@JsonProperty
	@Column(name="share_url")
	public String getShareUrl() {
		return shareUrl;
	}

	public void setShareUrl(String shareUrl) {
		this.shareUrl = shareUrl;
	}

	@JsonProperty
	@Column(name="content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@OneToOne(mappedBy="msg")
	public Comment getComment() {
		return comment;
	}

	public void setComment(Comment comment) {
		this.comment = comment;
	}
	
	
	
	
}
