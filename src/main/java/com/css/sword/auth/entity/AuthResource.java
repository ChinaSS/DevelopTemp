package com.css.sword.auth.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.css.sword.kernel.base.dataElement.AbsPersistObject;

/**
 * 资源URL
 */
@Entity
@Table(name="acl_res_url")
public class AuthResource extends AbsPersistObject{
	
	@Id
	private String resId;
	private String resName;
	private String resType;
	private String resUrl;
	private String resPid;
	private String resDesc;
	
	public AuthResource(){
		
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
