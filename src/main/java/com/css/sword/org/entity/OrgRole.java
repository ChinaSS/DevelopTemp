package com.css.sword.org.entity;

import java.io.Serializable;

import javax.persistence.*;




/**
 * The persistent class for the org_role database table.
 * 
 */
@Entity
@Table(name="org_role")
@NamedQuery(name="OrgRole.findAll", query="SELECT o FROM OrgRole o")
public class OrgRole extends com.css.sword.core.kernel.base.dataElement.AbsPersistObject implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String uuid;

	@Column(name="dir_code")
	private String dirCode;

	@Column(name="dir_name")
	private String dirName;

	private String hierarchy;

	@Column(name="manager_code")
	private String managerCode;

	@Column(name="manager_name")
	private String managerName;

	@Column(name="role_code")
	private String roleCode;

	@Column(name="role_name")
	private String roleName;

	private int sort;

	public OrgRole() {
	}

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = java.util.UUID.randomUUID().toString();
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

	public String getHierarchy() {
		return this.hierarchy;
	}

	public void setHierarchy(String hierarchy) {
		this.hierarchy = hierarchy;
	}

	public String getManagerCode() {
		return this.managerCode;
	}

	public void setManagerCode(String managerCode) {
		this.managerCode = managerCode;
	}

	public String getManagerName() {
		return this.managerName;
	}

	public void setManagerName(String managerName) {
		this.managerName = managerName;
	}

	public String getRoleCode() {
		return this.roleCode;
	}

	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
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