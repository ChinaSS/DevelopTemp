package com.css.sword.auth.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.alibaba.fastjson.JSONObject;
import com.css.sword.auth.entity.AuthResource;
import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;
import com.css.util.ServiceResult;
import com.css.util.ServiceResult.Code;

@ServiceContainer("/auth/res/")
public class AuthResourceService {
	
	/**
	 * 获取所有资源（包括资源目录）
	 */
	@Service("getAll")
	public ISwordResponse getResTree(ISwordRequest req) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			List<AuthResource> list = dao.findAllBySql("select * from acl_res_url", null, AuthResource.class);
			res.setModel(list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return res;
	}
	
	/**
	 * 获取资源分类
	 */
	@Service("getSort")
	public ISwordResponse getResSort(ISwordRequest req) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			List<Object> params = new ArrayList<Object>();
			params.add("1");
			List<AuthResource> list = dao.findAllBySql("select * from acl_res_url a where a.res_type=?", params, AuthResource.class);
			res.setModel(list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return res;
	}
	
	/**
	 * 获取某一资源分类下的资源
	 */
	@Service("getBySort")
	public ISwordResponse getResSub(ISwordRequest req) {
		List<AuthResource> result = new ArrayList<AuthResource>();
		try{
			String resPid = req.getData("resPid");
			if (resPid != null && !resPid.trim().equals("")) {
				IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
				List<Object> params = new ArrayList<Object>();
				params.add(resPid);
				params.add("2");//2表示资源实体
				result = dao.findAllBySql("select * from acl_res_url where res_pid = ? and res_type= ? ", params, AuthResource.class);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		res.setModel(result);
		return res;
	}
	
	/**
	 * 获取某一资源或分类
	 * 参数：resId
	 */
	@Service("getById")
	public ISwordResponse getRes(ISwordRequest req) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			String resId = req.getData("resId");
			if (resId != null && !resId.trim().equals("")) {
				IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
				List<Object> params = new ArrayList<Object>();
				params.add(resId);
				AuthResource resource = dao.findOneByPrimaryKey(AuthResource.class, resId);
				
				JSONObject result = (JSONObject)JSONObject.toJSON(resource);
				AuthResource resParent = dao.findOneByPrimaryKey(AuthResource.class, resource.getResPid());
				if (resParent != null) {
					result.put("resParent", resParent.getResName());
				}
				res.setModel(result);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return res;
	}
	
	/**
	 * 保存资源或分类
	 */
	@Service("save")
	public ISwordResponse saveRes(ISwordRequest req, AuthResource resource) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			//validateRes();校验暂时没有
			if (resource.getResId() != null && resource.getResId().length() > 0) { //update
				dao.update(resource);
			} else { //add
				resource.setResId(UUID.randomUUID().toString().replace("-", ""));
				dao.insert(resource);
			}
			res.setModel(new ServiceResult(Code.success.name(), "操作成功", resource));
		} catch (Exception e) {
			e.printStackTrace();
			res.setModel(new ServiceResult(Code.error.name(), "操作失败"));
		}
		return res;
	}
	
	/**
	 * 删除资源或分类
	 */
	@Service("delete")
	public ISwordResponse deleteRes(ISwordRequest req) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			String[] ids = req.getDataMap().get("ids");
			if (ids != null && ids.length > 0) {
				ids = ids[0].split(",");
				IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
				dao.deleteBatchByPrimaryKey(AuthResource.class, ids);
				res.setModel(new ServiceResult(Code.success.name(), "操作成功"));
			}
		} catch (Exception e) {
			e.printStackTrace();
			res.setModel(new ServiceResult(Code.error.name(), "操作失败"));

		}
		return res;
	}
	
}	
