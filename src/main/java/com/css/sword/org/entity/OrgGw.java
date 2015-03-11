package com.css.sword.org.entity;

import java.io.Serializable;

import javax.persistence.*;

import com.css.sword.kernel.base.dataElement.AbsPersistObject;


/**
 * The persistent class for the org_gw database table.
 * 
 */
@Entity
@Table(name="org_gw")
public class OrgGw extends AbsPersistObject implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="gw_code")
	private String gwCode;

	@Column(name="gw_name")
	private String gwName;

	private int sort;

	public OrgGw() {
	}

	public String getGwCode() {
		return this.gwCode;
	}

	public void setGwCode(String gwCode) {
		this.gwCode = gwCode;
	}

	public String getGwName() {
		return this.gwName;
	}

	public void setGwName(String gwName) {
		this.gwName = gwName;
	}

	public int getSort() {
		return this.sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

}