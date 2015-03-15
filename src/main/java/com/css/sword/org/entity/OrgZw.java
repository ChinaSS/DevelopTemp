package com.css.sword.org.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the org_zw database table.
 * 
 */
@Entity
@Table(name="org_zw")
@NamedQuery(name="OrgZw.findAll", query="SELECT o FROM OrgZw o")
public class OrgZw extends com.css.sword.kernel.base.dataElement.AbsPersistObject implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="zw_code")
	private String zwCode;

	private int sort;

	@Column(name="zw_name")
	private String zwName;

	public OrgZw() {
	}

	public String getZwCode() {
		return this.zwCode;
	}

	public void setZwCode(String zwCode) {
		this.zwCode = zwCode;
	}

	public int getSort() {
		return this.sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	public String getZwName() {
		return this.zwName;
	}

	public void setZwName(String zwName) {
		this.zwName = zwName;
	}

}