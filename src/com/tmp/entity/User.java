package com.tmp.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * 用户类
 * @author Administrator
 *
 */
@Entity
@Table(name="user")
public class User extends BaseEntity{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String userName;
	
	private String password;

	private String image;
	
	private String bgImage;
	
	private List<Comment> comments;
	
	/**
	 * “赞”过的评论
	 * 
	 */
	private List<Comment> laudComments;
	
	@NotEmpty(message="{user.userName.notEmpty}")
	@JsonProperty
	@Column(name="user_name")
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@JsonProperty
	@Column(name="password")
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	@JsonProperty
	@Column(name="image")
	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	@JsonProperty
	@Column(name="bg_image")
	public String getBgImage() {
		return bgImage;
	}

	public void setBgImage(String bgImage) {
		this.bgImage = bgImage;
	}

	@OneToMany(mappedBy="publishUser",fetch=FetchType.LAZY)
	public List<Comment> getComments() {
		return comments;
	}

	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}
	
	@ManyToMany(mappedBy="laudUsers",fetch=FetchType.LAZY)
	public List<Comment> getLaudComments() {
		return laudComments;
	}

	public void setLaudComments(List<Comment> laudComments) {
		this.laudComments = laudComments;
	}
	
	
	
	
}
