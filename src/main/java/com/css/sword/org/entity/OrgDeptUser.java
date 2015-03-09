package com.css.sword.org.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the org_dept_user database table.
 * 
 */
@Entity
@Table(name="org_dept_user")
public class OrgDeptUser implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String uuid;

	@Column(name="dept_id")
	private String deptId;

	@Column(name="user_code")
	private String userCode;

	@Column(name="user_name")
	private String userName;

	public OrgDeptUser() {
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