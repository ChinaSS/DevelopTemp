package com.css.util;


/**
 *	服务器返回前端对象
 *	code 		编号
 *	message		信息
 *	data		数据对象
 */
public class ServiceResult {
	
	private String code; //代号success: error info
	private String message;//描述
	private Object data;//数据

	public ServiceResult() {}
	
	public ServiceResult(String code, String message) {
		this.code = code;
		this.message = message;
	}
	
	public ServiceResult(String code, String message, Object data) {
		this.code = code;
		this.message = message;
		this.data = data;
	}
	
	public enum Code {
		success, error, info
	}
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	
}
