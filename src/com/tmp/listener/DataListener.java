package com.tmp.listener;

import java.util.Date;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.tmp.entity.BaseEntity;

/**
 * 数据持久化处理
 * 
 * @author Administrator
 *
 */
public class DataListener {
	
	
	@PrePersist
	public void onPersist(BaseEntity baseEntity){
		if(baseEntity.getCreateDate() == null){
			baseEntity.setCreateDate(new Date());
		}
		baseEntity.setModifyDate(new Date());
	}
	
	
	@PreUpdate
	public void onUpdate(BaseEntity baseEntity){
		baseEntity.setModifyDate(new Date());
	}
	
}
