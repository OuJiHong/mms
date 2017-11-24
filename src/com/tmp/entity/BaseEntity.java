package com.tmp.entity;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.tmp.listener.DataListener;

@JsonAutoDetect(fieldVisibility=Visibility.NONE,getterVisibility=Visibility.NONE)
@EntityListeners(value=DataListener.class)
@MappedSuperclass
public abstract class BaseEntity implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 6244706002315367583L;

	private Long id;
	
	private Date createDate;
	
	private Date modifyDate;
	
	
	@JsonProperty
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	@JsonProperty
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
	@Column(name="create_date")
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	@JsonProperty
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
	@Column(name="modify_date")
	public Date getModifyDate() {
		return modifyDate;
	}

	public void setModifyDate(Date modifyDate) {
		this.modifyDate = modifyDate;
	}
	
	
	@Override
	public boolean equals(Object obj) {
		if(obj == null || !obj.getClass().isAssignableFrom(BaseEntity.class)){
			return false;
		}
		
		BaseEntity otherEntity = (BaseEntity)obj;
		if(otherEntity.getId() != null && otherEntity.getId().equals(this.getId())){
			return true;
		}
		
		return false;
	}
	
	
	@Override
	public int hashCode() {
		if(this.getId() != null){
			return this.getId().hashCode();
		}
		
		return super.hashCode();
	}
	
	
	/**
	 * 获取距离当前时间的表述
	 * 用于列表
	 * @return
	 */
	@Transient
	public String getListDiffDateStr(){
		if(this.getCreateDate() != null){
			Calendar calendar = Calendar.getInstance();
			Long diffTime = calendar.getTime().getTime() - this.getCreateDate().getTime();
			Long minutes = TimeUnit.MINUTES.convert(diffTime, TimeUnit.MILLISECONDS);
			if(minutes == 0){
				return "刚刚";
			}
			
			if(minutes < TimeUnit.HOURS.toMinutes(1)){
				return minutes + "分钟前";
			}
			
			Long hours = TimeUnit.HOURS.convert(minutes, TimeUnit.MINUTES);
			if(hours < TimeUnit.DAYS.toHours(1)){
				return hours + "小时前";
			}
			
			Long days = TimeUnit.DAYS.convert(hours, TimeUnit.HOURS);
			
			return days + "天前";
		}
		
		return "刚刚";
	}
	
	
	/**
	 * 用于详情
	 * @return
	 */
	@Transient
	public String getDetailDiffDateStr(){
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy年MM月dd日 HH:mm");
		if(this.getCreateDate() != null){
			return dateFormat.format(this.getCreateDate());
		}
		
		return dateFormat.format(new Date());
	}
	
	
	
}
