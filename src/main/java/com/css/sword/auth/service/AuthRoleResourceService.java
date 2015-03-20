package com.css.sword.auth.service;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.css.sword.auth.entity.AuthResource;
import com.css.sword.auth.entity.AuthRoleRes;
import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;

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
			String roleid = req.getData("role_id");
			List<Object> param = new ArrayList<Object>();
			param.add(roleid);
			List<AuthRoleRes> list = dao.findAllBySql("select a.res_id from acl_role_res_url a where a.role_id = ?", param, AuthRoleRes.class);
			res.setModel(list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return res;
	}
	
}	
