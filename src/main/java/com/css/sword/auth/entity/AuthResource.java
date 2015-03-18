package com.css.sword.auth.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.css.sword.core.kernel.base.dataElement.AbsPersistObject;

/**
 * 资源URL
 */
@Entity
@Table(name="acl_res_url")
public class AuthResource extends AbsPersistObject{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="res_id")
	private String resId;
	@Column(name="res_name")
	private String resName;
	@Column(name="res_type")
	private String resType;
	@Column(name="res_url")
	private String resUrl;
	@Column(name="res_pid")
	private String resPid;
	@Column(name="res_desc")
	private String resDesc;
	
	public AuthResource(){
	}
	
	@Override
	public String toString() {
		return this.resId + ":" + this.resName + ":" + resType + ":" + resUrl + ":" + resPid + ":" + resDesc;
	}

	/** 
	 * 判断该资源是否为资源实体 即叶子
 	 */
	public boolean isLeaf() {
		
		return (this.resType != null && this.resType.equals("2"));
	}
	
	public String getResId() {
		return resId;
	}
	public void setResId(String resId) {
		this.resId = resId;
	}
	public String getResName() {
		return resName;
	}
	public void setResName(String resName) {
		this.resName = resName;
	}
	public String getResType() {
		return resType;
	}
	public void setResType(String resType) {
		this.resType = resType;
	}
	public String getResUrl() {
		return resUrl;
	}
	public void setResUrl(String resUrl) {
		this.resUrl = resUrl;
	}
	public String getResPid() {
		return resPid;
	}
	public void setResPid(String resPid) {
		this.resPid = resPid;
	}
	public String getResDesc() {
		return resDesc;
	}
	public void setResDesc(String resDesc) {
		this.resDesc = resDesc;
	}
	
}
