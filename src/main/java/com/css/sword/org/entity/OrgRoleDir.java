package com.css.sword.org.entity;

import java.io.Serializable;

import javax.persistence.*;

import com.css.sword.kernel.base.dataElement.AbsPersistObject;


/**
 * The persistent class for the org_role_dir database table.
 * 
 */
@Entity
@Table(name="org_role_dir")
public class OrgRoleDir extends AbsPersistObject implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="dir_code")
	private String dirCode;

	@Column(name="dir_name")
	private String dirName;

	@Column(name="p_dir_code")
	private String pDirCode;

	public OrgRoleDir() {
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

	public String getPDirCode() {
		return this.pDirCode;
	}

	public void setPDirCode(String pDirCode) {
		this.pDirCode = pDirCode;
	}

}