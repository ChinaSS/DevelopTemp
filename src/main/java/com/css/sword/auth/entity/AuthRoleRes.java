package com.css.sword.auth.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.css.sword.core.kernel.base.dataElement.AbsPersistObject;

/**
 *	资源-角色映射
 */
@Entity
@Table(name="acl_role_res_url")
public class AuthRoleRes extends AbsPersistObject {
	
	private static final long serialVersionUID = 1L;
	
	@Id
	private String uuid;
	@Column(name="role_id")
	private String roleId;
	@Column(name="res_id")
	private String resId;
	
	public AuthRoleRes() {
		
	}
	
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getResId() {
		return resId;
	}

	public void setResId(String resId) {
		this.resId = resId;
	}
	
}
