package com.css.sword.org.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the org_dept database table.
 * 
 */
@Entity
@Table(name="org_dept")
@NamedQuery(name="OrgDept.findAll", query="SELECT o FROM OrgDept o")
public class OrgDept extends com.css.sword.kernel.base.dataElement.AbsPersistObject implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="dept_id")
	private String deptId;

	@Column(name="cost_center_code")
	private String costCenterCode;

	@Column(name="cost_center_name")
	private String costCenterName;

	@Column(name="dept_code")
	private String deptCode;

	@Column(name="dept_name")
	private String deptName;

	private String extend1;

	private String extend10;

	private String extend11;

	private String extend12;

	private String extend13;

	private String extend14;

	private String extend15;

	private String extend16;

	private String extend17;

	private String extend18;

	private String extend19;

	private String extend2;

	private String extend20;

	private String extend3;

	private String extend4;

	private String extend5;

	private String extend6;

	private String extend7;

	private String extend8;

	private String extend9;

	private String groupname;

	private String leader;

	@Column(name="leader_code")
	private String leaderCode;

	private String level;

	private String manager;

	@Column(name="manager_code")
	private String managerCode;

	private String ou;

	@Column(name="p_dept_id")
	private String pDeptId;

	@Column(name="p_dept_name")
	private String pDeptName;

	private int sort;

	public OrgDept() {
	}

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getCostCenterCode() {
		return this.costCenterCode;
	}

	public void setCostCenterCode(String costCenterCode) {
		this.costCenterCode = costCenterCode;
	}

	public String getCostCenterName() {
		return this.costCenterName;
	}

	public void setCostCenterName(String costCenterName) {
		this.costCenterName = costCenterName;
	}

	public String getDeptCode() {
		return this.deptCode;
	}

	public void setDeptCode(String deptCode) {
		this.deptCode = deptCode;
	}

	public String getDeptName() {
		return this.deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public String getExtend1() {
		return this.extend1;
	}

	public void setExtend1(String extend1) {
		this.extend1 = extend1;
	}

	public String getExtend10() {
		return this.extend10;
	}

	public void setExtend10(String extend10) {
		this.extend10 = extend10;
	}

	public String getExtend11() {
		return this.extend11;
	}

	public void setExtend11(String extend11) {
		this.extend11 = extend11;
	}

	public String getExtend12() {
		return this.extend12;
	}

	public void setExtend12(String extend12) {
		this.extend12 = extend12;
	}

	public String getExtend13() {
		return this.extend13;
	}

	public void setExtend13(String extend13) {
		this.extend13 = extend13;
	}

	public String getExtend14() {
		return this.extend14;
	}

	public void setExtend14(String extend14) {
		this.extend14 = extend14;
	}

	public String getExtend15() {
		return this.extend15;
	}

	public void setExtend15(String extend15) {
		this.extend15 = extend15;
	}

	public String getExtend16() {
		return this.extend16;
	}

	public void setExtend16(String extend16) {
		this.extend16 = extend16;
	}

	public String getExtend17() {
		return this.extend17;
	}

	public void setExtend17(String extend17) {
		this.extend17 = extend17;
	}

	public String getExtend18() {
		return this.extend18;
	}

	public void setExtend18(String extend18) {
		this.extend18 = extend18;
	}

	public String getExtend19() {
		return this.extend19;
	}

	public void setExtend19(String extend19) {
		this.extend19 = extend19;
	}

	public String getExtend2() {
		return this.extend2;
	}

	public void setExtend2(String extend2) {
		this.extend2 = extend2;
	}

	public String getExtend20() {
		return this.extend20;
	}

	public void setExtend20(String extend20) {
		this.extend20 = extend20;
	}

	public String getExtend3() {
		return this.extend3;
	}

	public void setExtend3(String extend3) {
		this.extend3 = extend3;
	}

	public String getExtend4() {
		return this.extend4;
	}

	public void setExtend4(String extend4) {
		this.extend4 = extend4;
	}

	public String getExtend5() {
		return this.extend5;
	}

	public void setExtend5(String extend5) {
		this.extend5 = extend5;
	}

	public String getExtend6() {
		return this.extend6;
	}

	public void setExtend6(String extend6) {
		this.extend6 = extend6;
	}

	public String getExtend7() {
		return this.extend7;
	}

	public void setExtend7(String extend7) {
		this.extend7 = extend7;
	}

	public String getExtend8() {
		return this.extend8;
	}

	public void setExtend8(String extend8) {
		this.extend8 = extend8;
	}

	public String getExtend9() {
		return this.extend9;
	}

	public void setExtend9(String extend9) {
		this.extend9 = extend9;
	}

	public String getGroupname() {
		return this.groupname;
	}

	public void setGroupname(String groupname) {
		this.groupname = groupname;
	}

	public String getLeader() {
		return this.leader;
	}

	public void setLeader(String leader) {
		this.leader = leader;
	}

	public String getLeaderCode() {
		return this.leaderCode;
	}

	public void setLeaderCode(String leaderCode) {
		this.leaderCode = leaderCode;
	}

	public String getLevel() {
		return this.level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getManager() {
		return this.manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}

	public String getManagerCode() {
		return this.managerCode;
	}

	public void setManagerCode(String managerCode) {
		this.managerCode = managerCode;
	}

	public String getOu() {
		return this.ou;
	}

	public void setOu(String ou) {
		this.ou = ou;
	}

	public String getPDeptId() {
		return this.pDeptId;
	}

	public void setPDeptId(String pDeptId) {
		this.pDeptId = pDeptId;
	}

	public String getPDeptName() {
		return this.pDeptName;
	}

	public void setPDeptName(String pDeptName) {
		this.pDeptName = pDeptName;
	}

	public int getSort() {
		return this.sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

}