package com.css.sword.org.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the org_dept_user database table.
 * 
 */
@Entity
@Table(name="org_dept_user")
@NamedQuery(name="OrgDeptUser.findAll", query="SELECT o FROM OrgDeptUser o")
public class OrgDeptUser extends com.css.sword.core.kernel.base.dataElement.AbsPersistObject implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String uuid;

	@Column(name="dept_id")
	private String deptId;

	private int jz;

	@Column(name="user_code")
	private String userCode;

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

	public int getJz() {
		return this.jz;
	}

	public void setJz(int jz) {
		this.jz = jz;
	}

	public String getUserCode() {
		return this.userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

}