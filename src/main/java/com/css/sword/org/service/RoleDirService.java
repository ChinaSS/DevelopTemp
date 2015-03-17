package com.css.sword.org.service;

import java.util.ArrayList;
import java.util.List;

import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.dataElement.IValueObject;
import com.css.sword.core.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.org.entity.OrgRole;
import com.css.sword.org.entity.OrgRoleDir;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;

@ServiceContainer
public class RoleDirService {
	
	//根据角色目录id查询出角色目录信息
	@Service(serviceName="orgGetRoleDir")
	public ISwordResponse orgGetRoleDir(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		
		try {
			String sql = "select * from org_role_dir where dir_code=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("dir_code"));
			OrgRoleDir roleDir = dao.findOneBySql(sql, param, (Class<? extends IValueObject>) OrgRoleDir.class);
			dRes.setModel(roleDir);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
		
	//角色目录导入
	@Service(serviceName="orgImportRoleDir")
	public ISwordResponse importRoleDir(ISwordRequest iReq,List<OrgRoleDir> list) throws SwordBaseCheckedException{
		
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
	//获取角色目录列表
	@Service(serviceName="orgGetAllRoleDir")
	public ISwordResponse getAllRoleDir(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select * from org_role_dir";
			List<OrgRoleDir> result = dao.findAllBySql(sql, null ,OrgRoleDir.class);
			dRes.setModel(result);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
}
