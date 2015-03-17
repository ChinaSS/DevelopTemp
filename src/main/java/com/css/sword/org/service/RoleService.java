package com.css.sword.org.service;

import java.util.ArrayList;
import java.util.List;

import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.org.entity.OrgRole;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;
import com.css.util.Page;

@ServiceContainer
public class RoleService {
	//角色导入
	@Service(serviceName="importRole")
	public ISwordResponse importRole(ISwordRequest iReq,List<OrgRole> list) throws SwordBaseCheckedException{
		
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
	
	//分页查询，根据所属目录编号查找出角色列表
	@Service(serviceName="getRoleByPidPage")
	public ISwordResponse getRoleByPid(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		//IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select * from org_role where dir_code=?";
			List<Object> param = new ArrayList<Object>();
			String dir_code = iReq.getData("dir_code");
			param.add(dir_code);
			//List<OrgRole> result = dao.findAllBySqlWithPaging(sql, param, 2, 2, OrgRole.class);
			//Page page = new Page(iReq);
			dRes.setModel(new Page(iReq).getData(sql, param, OrgRole.class));
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
}
