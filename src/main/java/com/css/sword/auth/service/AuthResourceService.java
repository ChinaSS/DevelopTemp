package com.css.sword.auth.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.alibaba.fastjson.JSONObject;
import com.css.sword.auth.entity.AuthResource;
import com.css.sword.kernel.base.annotation.Service;
import com.css.sword.kernel.base.annotation.ServiceContainer;
import com.css.sword.kernel.base.persistence.IPersistenceService;
import com.css.sword.kernel.utils.SwordPersistenceUtils;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;
import com.css.util.ServiceResult;
import com.css.util.ServiceResult.Code;

@ServiceContainer
public class AuthResourceService {
	
	/**
	 * 获取所有资源
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Service(serviceName="authGetResAll")
	public ISwordResponse getResTree(ISwordRequest req) {
		List result = new ArrayList();
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			List<AuthResource> list = dao.findAllBySql("select * from acl_res_url", null, AuthResource.class);
			
			//资源信息适配前端ztree[目前用jsonObject解决，之后添加view层]
			for (AuthResource resource : list) {
				JSONObject jsonObject = (JSONObject)JSONObject.toJSON(resource);
				if (!resource.isLeaf()) {
					jsonObject.put("isParent", true);
					jsonObject.put("open", true);
				}
				result.add(jsonObject);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		res.setModel(result);
		return res;
	}
	
	/**
	 * 获取某一资源分类下的资源
	 */
	@Service(serviceName="authGetResSub")
	public ISwordResponse getResSub(ISwordRequest req) {
		List<AuthResource> result = new ArrayList<AuthResource>();
		try{
			String[] resPid = req.getDataMap().get("resPid");
			if (resPid != null && resPid.length > 0) {
				IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
				List<Object> params = new ArrayList<Object>();
				params.add(resPid[0]);
				result = dao.findAllBySql("select * from acl_res_url where res_pid = ?", params, AuthResource.class);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		res.setModel(result);
		return res;
	}
	
	/**
	 * 获取某一资源
	 */
	@Service(serviceName="authGetRes")
	public ISwordResponse getRes(ISwordRequest req) {
		JSONObject result = null;
		try{
			String[] resId = req.getDataMap().get("resId");
			if (resId != null && resId.length > 0) {
				IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
				List<Object> params = new ArrayList<Object>();
				params.add(resId[0]);
				AuthResource resource = dao.findOneByPrimaryKey(AuthResource.class, resId[0]);
				
				result = (JSONObject)JSONObject.toJSON(resource);
				AuthResource resParent = dao.findOneByPrimaryKey(AuthResource.class, resource.getResPid());
				if (resParent != null)
					result.put("resParent", resParent.getResName());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		res.setModel(result);
		return res;
	}
	
	
	/**
	 * 保存资源
	 */
	@Service(serviceName="authSaveRes")
	public ISwordResponse saveRes(ISwordRequest req, AuthResource resource) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			if (resource.getResId() != null && resource.getResId().length() > 0) { //update
				dao.update(resource);
			} else { //add
				resource.setResId(UUID.randomUUID().toString().replace("-", ""));
				dao.insert(resource);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		res.setModel(new ServiceResult(Code.success.name(), "操作成功"));
		return res;
	}
	
	@Service(serviceName="authDeleteRes")
	public ISwordResponse deleteRes(ISwordRequest req) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			String[] ids = req.getDataMap().get("ids");
			if (ids != null && ids.length > 0) {
				ids = ids[0].split(",");
				IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
				dao.deleteBatchByPrimaryKey(AuthResource.class, ids);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		res.setModel(new ServiceResult(Code.success.name(), "success"));
		return res;
	}
	
}	
