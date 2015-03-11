package com.css.sword.auth.service;

import java.util.List;

import com.css.sword.auth.entity.AuthResource;
import com.css.sword.kernel.base.annotation.Service;
import com.css.sword.kernel.base.annotation.ServiceContainer;
import com.css.sword.kernel.base.persistence.IPersistenceService;
import com.css.sword.kernel.utils.SwordPersistenceUtils;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;

@ServiceContainer
public class TestService {
	
	@Service(serviceName="test")
	public ISwordResponse test(ISwordRequest req) throws Exception {
		System.out.println("*****************");
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		List<AuthResource> list = dao.findAll("select * from acl_res_url", null, AuthResource.class);
		return SwordResponseFactory.createSwordResponseInstance(req);
	}
	
}
