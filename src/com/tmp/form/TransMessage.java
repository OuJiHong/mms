package com.tmp.form;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * 消息
 * @author Administrator
 *
 */
public class TransMessage implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 6846684544238810469L;
	
	public static TransMessage SUCCESS = new TransMessage(Type.success,"操作成功");
	public static TransMessage ERROR = new TransMessage(Type.error,"操作失败");


	public enum Type{
		success,
		warn,
		error
	}
	
	private Type type;
	
	private String content;
	
	private Map<String,Object> data = new HashMap<String,Object>();
	
	
	public TransMessage(Type type, String content) {
		super();
		this.type = type;
		this.content = content;
	}

	
	/**
	 * 成功信息
	 * @param msg
	 * @return
	 */
	public static TransMessage success(String msg){
		return new TransMessage(Type.success, msg);
	}
	
	
	
	/**
	 * 错误信息
	 * @param msg
	 * @return
	 */
	public static TransMessage error(String msg){
		return new TransMessage(Type.error, msg);
	}
	
	
	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Map<String, Object> getData() {
		return data;
	}

	public void setData(Map<String, Object> data) {
		this.data = data;
	}
	
	/**
	 * 添加数据
	 * @param key
	 * @param value
	 */
	public void addData(String key, Object value){
		this.getData().put(key, value);
	}
	
}
