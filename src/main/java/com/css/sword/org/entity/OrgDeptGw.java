package com.css.sword.org.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the org_dept_gw database table.
 * 
 */
@Entity
@Table(name="org_dept_gw")
@NamedQuery(name="OrgDeptGw.findAll", query="SELECT o FROM OrgDeptGw o")
public class OrgDeptGw extends com.css.sword.core.kernel.base.dataElement.AbsPersistObject implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String uuid;

	@Column(name="dept_id")
	private String deptId;

	@Column(name="gw_code")
	private String gwCode;

	public OrgDeptGw() {
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

}