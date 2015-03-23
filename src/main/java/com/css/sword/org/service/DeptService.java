package com.css.sword.org.service;

import java.util.ArrayList;
import java.util.List;

import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.dataElement.IValueObject;
import com.css.sword.core.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.org.entity.OrgDept;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;
import com.css.util.Page;

@ServiceContainer
public class DeptService {
	/**
	 * 根据部门ID获取部门json对象
	 * @param iReq
	 * @return
	 * @throws SwordBaseCheckedException
	 */
	@Service(serviceName="orgGetDept")
	public ISwordResponse getDept(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		
		try {
			String sql = "select * from org_dept where dept_id=?";
			List<Object> param = new ArrayList<Object>();
			param.add("D001");
			OrgDept dept = dao.findOneBySql(sql, param, (Class<? extends IValueObject>) OrgDept.class);
			dRes.setModel(dept);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//部门导入
	@Service(serviceName="orgImportDept")
	public ISwordResponse importDept(ISwordRequest iReq,List<OrgDept> list) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			if(dao.insertBatch(list)){
				dRes.setModel("");
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//获取部门列表
	@Service(serviceName="orgGetAllDept")
	public ISwordResponse getAllDept(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select * from org_dept";
			List<OrgDept> result = dao.findAllBySql(sql, null ,OrgDept.class);
			dRes.setModel(result);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//获取部门列表，带分页
	@Service(serviceName="orgGetAllDeptPage")
	public ISwordResponse orgGetAllDeptPage(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select * from org_dept";
			dRes.setModel(new Page(iReq).getData(sql, null, OrgDept.class));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
}
