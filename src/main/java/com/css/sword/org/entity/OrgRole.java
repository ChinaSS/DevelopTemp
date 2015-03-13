package com.css.sword.org.entity;

import java.io.Serializable;

import javax.persistence.*;

import com.css.sword.kernel.base.dataElement.AbsPersistObject;


/**
 * The persistent class for the org_role database table.
 * 
 */
@Entity
@Table(name="org_role")
//@NamedQuery(name="OrgRole.findAll", query="SELECT o FROM OrgRole o")
public class OrgRole extends AbsPersistObject implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="role_code")
	private String roleCode;

	@Column(name="dir_code")
	private String dirCode;

	@Column(name="dir_name")
	private String dirName;

	private String manager;

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

	public String getDirName() {
		return this.dirName;
	}

	public void setDirName(String dirName) {
		this.dirName = dirName;
	}

	public String getManager() {
		return this.manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
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