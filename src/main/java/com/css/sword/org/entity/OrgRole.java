package com.css.sword.org.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the org_role database table.
 * 
 */
@Entity
@Table(name="org_role")
public class OrgRole implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="role_code")
	private String roleCode;

	@Column(name="dir_code")
	private String dirCode;

	@Column(name="manager_code")
	private String managerCode;

	@Column(name="role_name")
	private String roleName;

	private int sort;

	public OrgRole() {
	}

	public String getRoleCode() {
		return this.roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}

	public String getDirCode() {
		return this.dirCode;
	}

	public void setDirCode(String dirCode) {
		this.dirCode = dirCode;
	}

	public String getManagerCode() {
		return this.managerCode;
	}

	public void setManagerCode(String managerCode) {
		this.managerCode = managerCode;
	}

	public String getRoleName() {
		return this.roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public int getSort() {
		return this.sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

}