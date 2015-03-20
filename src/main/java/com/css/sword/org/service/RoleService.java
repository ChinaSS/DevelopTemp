package com.css.sword.org.service;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.dataElement.IValueObject;
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
	@Service(serviceName="orgImportRole")
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
	
	//角色id验证
	@Service(serviceName="orgValidateRoleCode")
	public ISwordResponse orgValidateRoleCode(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select role_code from org_role where role_code=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("role_code"));
			OrgRole role = dao.findOneBySql(sql, param, OrgRole.class);
			dRes.setModel(role==null?true:false);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
		
	//根据角色id查询出角色信息
	@Service(serviceName="orgGetRole")
	public ISwordResponse orgGetRole(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		
		try {
			String sql = "select * from org_role where role_code=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("role_code"));
			OrgRole role = dao.findOneBySql(sql, param, (Class<? extends IValueObject>) OrgRole.class);
			dRes.setModel(role);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//保存角色
	@Service(serviceName="orgSaveRole")
	public ISwordResponse orgSaveRole(ISwordRequest iReq,OrgRole role) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		JSONObject json = new JSONObject();
		json.put("status", false);
		String saveType = iReq.getData("saveType");
		try {
			if(saveType.equals("insert")? dao.insert(role) :dao.update(role)){
				json.put("status", true);
				json.put("message", "保存成功.");
			}else{
				json.put("message", "保存失败.");
			}
			dRes.setModel(json);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			json.put("message", "保存失败.");
			dRes.setModel(json);
			e.printStackTrace();
		}
		
		return dRes;
	}
		
	//分页查询，根据所属目录编号查找出角色列表
	@Service(serviceName="orgGetRoleByPidPage")
	public ISwordResponse getRoleByPid(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		//IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String dir_code = iReq.getData("dir_code");
			//如果为root则全查
			String sql = "select * from org_role"+(dir_code.equals("root")?"":" where dir_code=?");
			List<Object> param = new ArrayList<Object>();
			
			param.add(dir_code);
			//List<OrgRole> result = dao.findAllBySqlWithPaging(sql, param, 2, 2, OrgRole.class);
			//Page page = new Page(iReq);
			dRes.setModel(new Page(iReq).getData(sql, dir_code.equals("root")? null :param, OrgRole.class));
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
}
