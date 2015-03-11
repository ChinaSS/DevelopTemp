package com.css.sword.auth.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.css.sword.kernel.base.dataElement.AbsPersistObject;

/**
 *	资源-角色映射
 */
@Entity
@Table(name="acl_role_res_url")
public class AuthRoleRes extends AbsPersistObject {
	
	@Id
	private String uuid;
	private String roleCode;
	private String resCode;
	
	public AuthRoleRes() {
		
	}
	
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getRoleCode() {
		return roleCode;
	}
	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}
	public String getResCode() {
		return resCode;
	}
	public void setResCode(String resCode) {
		this.resCode = resCode;
	}
	
}
