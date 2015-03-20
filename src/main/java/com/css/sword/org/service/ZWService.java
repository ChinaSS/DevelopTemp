package com.css.sword.org.service;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.org.entity.OrgZw;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;
import com.css.util.Page;

@ServiceContainer
public class ZWService {
	//职务导入
	@Service(serviceName="orgImportZw")
	public ISwordResponse importZw(ISwordRequest iReq,List<OrgZw> list) throws SwordBaseCheckedException{
		
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
	
	//查询职务列表
	@Service(serviceName="orgGetAllZw")
	public ISwordResponse orgGetAllZw(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		//IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			dRes.setModel(new Page(iReq).getData("select * from org_zw", null, OrgZw.class));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//通过职务id查询出职务
	@Service(serviceName="orgGetZwById")
	public ISwordResponse orgGetZwById(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select * from org_zw where zw_code=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("zw_code"));
			dRes.setModel(dao.findOneBySql(sql, param, OrgZw.class));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//保存职务
	@Service(serviceName="orgSaveZW")
	public ISwordResponse orgSaveZW(ISwordRequest iReq,OrgZw zw) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		JSONObject json = new JSONObject();
		json.put("status", false);
		try {
			if(dao.saveOrUpdate(zw)){
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
	//职务id验证
	@Service(serviceName="orgValidateZwCode")
	public ISwordResponse orgValidateZwCode(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select zw_code from org_zw where zw_code=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("zw_code"));
			OrgZw zw = dao.findOneBySql(sql, param, OrgZw.class);
			dRes.setModel(zw==null?true:false);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
}
