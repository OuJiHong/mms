package com.tmp.exception;

/**
 * 业务异常
 * 
 * @author Administrator
 *
 */
public class BizException extends Exception{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -818892684717582552L;

	private String code = "99";
	
	private String msg;

	

	public BizException(String msg) {
		super(msg);
		this.msg = msg;
	}

	
	public BizException(String code, String msg) {
		super(msg);
		this.code = code;
		this.msg = msg;
	}
	

	public BizException(String code, String msg, Throwable cause) {
		super(msg, cause);
		this.code = code;
		this.msg = msg;
	}
	
	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}
	
	
}
