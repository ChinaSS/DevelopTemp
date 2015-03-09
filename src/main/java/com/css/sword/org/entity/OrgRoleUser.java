package com.css.sword.org.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the org_role_user database table.
 * 
 */
@Entity
@Table(name="org_role_user")
public class OrgRoleUser implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String uuid;

	@Column(name="role_code")
	private String roleCode;

	@Column(name="user_code")
	private String userCode;

	public OrgRoleUser() {
	}

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getRoleCode() {
		return this.roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

	public String getUserCode() {
		return this.userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

}