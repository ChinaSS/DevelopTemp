package com.css.sword.org.entity;

import java.io.Serializable;

import javax.persistence.*;

import com.css.sword.kernel.base.dataElement.AbsPersistObject;


/**
 * The persistent class for the org_dept_gw_user database table.
 * 
 */
@Entity
@Table(name="org_dept_gw_user")
public class OrgDeptGwUser extends AbsPersistObject implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String uuid;

	@Column(name="dept_id")
	private String deptId;

	@Column(name="gw_code")
	private String gwCode;

	@Column(name="user_code")
	private String userCode;

	@Column(name="user_name")
	private String userName;

	public OrgDeptGwUser() {
	}

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getGwCode() {
		return this.gwCode;
	}

	public void setGwCode(String gwCode) {
		this.gwCode = gwCode;
	}

	public String getUserCode() {
		return this.userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

}