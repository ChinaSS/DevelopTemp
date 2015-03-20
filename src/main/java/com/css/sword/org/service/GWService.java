package com.css.sword.org.service;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.org.entity.OrgGw;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;
import com.css.util.Page;

@ServiceContainer
public class GWService {
	//岗位导入
	@Service(serviceName="orgImportGw")
	public ISwordResponse importGw(ISwordRequest iReq,List<OrgGw> list) throws SwordBaseCheckedException{
		
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
	
	//查询岗位列表
	@Service(serviceName="orgGetAllGw")
	public ISwordResponse orgGetAllGw(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		//IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			dRes.setModel(new Page(iReq).getData("select * from org_gw", null, OrgGw.class));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//通过岗位id查询出岗位
	@Service(serviceName="orgGetGwById")
	public ISwordResponse orgGetGwById(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select * from org_gw where gw_code=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("gw_code"));
			dRes.setModel(dao.findOneBySql(sql, param, OrgGw.class));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//保存岗位
	@Service(serviceName="orgSaveGW")
	public ISwordResponse orgSaveGW(ISwordRequest iReq,OrgGw gw) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		JSONObject json = new JSONObject();
		json.put("status", false);
		try {
			if(dao.saveOrUpdate(gw)){
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
	//岗位id验证
	@Service(serviceName="orgValidateGwCode")
	public ISwordResponse orgValidateGwCode(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select gw_code from org_gw where gw_code=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("gw_code"));
			OrgGw gw = dao.findOneBySql(sql, param, OrgGw.class);
			dRes.setModel(gw==null?true:false);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
}
