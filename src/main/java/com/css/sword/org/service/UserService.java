package com.css.sword.org.service;

import java.util.ArrayList;
import java.util.List;

import com.css.sword.kernel.base.annotation.Service;
import com.css.sword.kernel.base.annotation.ServiceContainer;
import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.base.persistence.IPersistenceService;
import com.css.sword.kernel.utils.SwordPersistenceUtils;
import com.css.sword.org.entity.OrgRole;
import com.css.sword.org.entity.OrgUser;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;

@ServiceContainer
public class UserService {
	
	//人员导入
	@Service(serviceName="importUser")
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
	@Service(serviceName="getUserByDeptId")
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
}
