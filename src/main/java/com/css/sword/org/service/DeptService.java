package com.css.sword.org.service;

import java.util.ArrayList;
import java.util.List;

import com.css.sword.kernel.base.annotation.Service;
import com.css.sword.kernel.base.annotation.ServiceContainer;
import com.css.sword.kernel.base.dataElement.IPersistObject;
import com.css.sword.kernel.base.dataElement.IValueObject;
import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.base.persistence.IPersistenceService;
import com.css.sword.kernel.utils.SwordPersistenceUtils;
import com.css.sword.org.entity.OrgDept;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;
import com.css.util.ExcelToEntityList;

@ServiceContainer
public class DeptService {
	/**
	 * 根据部门ID获取部门json对象
	 * @param iReq
	 * @return
	 * @throws SwordBaseCheckedException
	 */
	@Service(serviceName="getDept")
	public ISwordResponse getDept(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		
		try {
			String sql = "select * from org_dept where dept_id=?";
			List<Object> param = new ArrayList<Object>();
			param.add("D001");
//			OrgDept dept = dao.findOne(sql, param, (Class<? extends IValueObject>) OrgDept.class);
//			dRes.setModel(dept);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//部门导入
	@Service(serviceName="importDept")
	public ISwordResponse importDept(ISwordRequest iReq,List<OrgDept> list) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		
		try {
//			if(dao.insert(list)){
//				dRes.setModel("{status:200}");
//			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
}
