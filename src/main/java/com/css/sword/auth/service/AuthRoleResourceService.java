package com.css.sword.auth.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.css.sword.auth.entity.AuthRoleRes;
import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;
import com.css.util.ServiceResult;
import com.css.util.ServiceResult.Code;

@ServiceContainer
public class AuthRoleResourceService {
	
	/**
	 * 根据角色id，获取角色资源
	 */
	@Service(serviceName="authGetRoleRes")
	public ISwordResponse getRoleRes(ISwordRequest req) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			String roleId = req.getData("roleId");
			if (roleId != null && roleId.trim().length() > 0) {
				List<Object> param = new ArrayList<Object>();
				param.add(roleId);
				List<AuthRoleRes> list = dao.findAllBySql("select a.res_id from acl_role_res_url a where a.role_id = ?", param, AuthRoleRes.class);
				res.setModel(list);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return res;
	}
	
	/**
	 * 保存角色-资源
	 */
	@Service(serviceName="authSaveRoleRes")
	public ISwordResponse saveRoleRes(ISwordRequest req) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			String roleId = req.getData("roleId");
			String resIds = req.getData("resIds");
			if (roleId != null && roleId.trim().length() > 0) {
				if (resIds != null && resIds.trim().length() > 0) {
					//先删除之前的授权
					/*
					String sql = "delete from acl_role_res_url where role_id = ?";
					List<Object> params = new ArrayList<Object>();
					params.add(roleId);
					dao.deleteBySql(sql, params);
					*/
					String sql = "select * from acl_role_res_url where role_id = ?";
					List<Object> params = new ArrayList<Object>();
					params.add(roleId);
					List<AuthRoleRes> list = dao.findAllBySql(sql, params, AuthRoleRes.class);
					dao.deleteBatch(list);
					//保存现在的授权
					String[] resIdArr = resIds.split(",");
					for (String resId : resIdArr) {
						AuthRoleRes roleRes = new AuthRoleRes();
						roleRes.setUuid(UUID.randomUUID().toString().replace("-", ""));
						roleRes.setRoleId(roleId);
						roleRes.setResId(resId);
						dao.insert(roleRes);
					}
				}
			}
			res.setModel(new ServiceResult(Code.success.name(), "操作成功"));
		} catch (Exception e) {
			e.printStackTrace();
			res.setModel(new ServiceResult(Code.error.name(), "操作失败"));
		}
		return res;
	}
	
	/**
	 * 根据角色id，获取角色资源
	 */
	@Service(serviceName="authGetResRole")
	public ISwordResponse getResRole(ISwordRequest req) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			String resId = req.getData("resId");
			if (resId != null && resId.trim().length() > 0) {
				List<Object> param = new ArrayList<Object>();
				param.add(resId);
				List<AuthRoleRes> list = dao.findAllBySql("select a.role_id from acl_role_res_url a where a.res_id = ?", param, AuthRoleRes.class);
				res.setModel(list);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return res;
	}
	
	/**
	 * 保存角色-资源
	 */
	@Service(serviceName="authSaveResRole")
	public ISwordResponse saveResRole(ISwordRequest req) {
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			String resId = req.getData("resId");
			String roleIds = req.getData("roleIds");
			if (resId != null && resId.trim().length() > 0) {
				if (roleIds != null && roleIds.trim().length() > 0) {
					String sql = "select * from acl_role_res_url where res_id = ?";
					List<Object> params = new ArrayList<Object>();
					params.add(resId);
					List<AuthRoleRes> list = dao.findAllBySql(sql, params, AuthRoleRes.class);
					dao.deleteBatch(list);
					//保存现在的授权
					String[] roleIdArr = roleIds.split(",");
					for (String roleId : roleIdArr) {
						AuthRoleRes roleRes = new AuthRoleRes();
						roleRes.setUuid(UUID.randomUUID().toString().replace("-", ""));
						roleRes.setRoleId(roleId);
						roleRes.setResId(resId);
						dao.insert(roleRes);
					}
				}
			}
			res.setModel(new ServiceResult(Code.success.name(), "操作成功"));
		} catch (Exception e) {
			e.printStackTrace();
			res.setModel(new ServiceResult(Code.error.name(), "操作失败"));
		}
		return res;
	}
	
}	
