package com.css.sword.org.service;

import java.util.ArrayList;
import java.util.List;

import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.org.entity.OrgRole;
import com.css.sword.org.entity.OrgUser;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;
import com.css.util.Page;

@ServiceContainer
public class UserService {
	
	//人员导入
	@Service(serviceName="orgImportUser")
	public ISwordResponse importUser(ISwordRequest iReq,List<OrgUser> list) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			dao.insertBatch(list);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	//根据所属部门id查询出人员列表
	@Service(serviceName="orgGetUserByDeptId")
	public ISwordResponse getUserByDeptId(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select * from org_user where dept_id=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getDataMap().get("dept_id"));
			List<OrgRole> result = dao.findAllBySql(sql, null ,OrgRole.class);
			dRes.setModel(result);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//分页查询，根据部门id，查询出人员列表
	@Service(serviceName="orgGetUserByDeptIdPage")
	public ISwordResponse getUserByDeptIdPage(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		try {
			String sql = "select * from org_user where dept_id=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("dept_id"));
			dRes.setModel(new Page(iReq).getData(sql, param, OrgUser.class));
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return dRes;
	}
}
