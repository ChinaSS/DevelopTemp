package com.css.sword.auth.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.css.sword.auth.entity.AuthResource;
import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;

@ServiceContainer
public class TestService {
	
	@Service(serviceName="getall")
	public ISwordResponse getAll(ISwordRequest req) {
		List<AuthResource> result = null;
		try {
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			result = dao.findAllBySql("select * from acl_res_url", null, AuthResource.class);
		} catch(Exception e) {
			e.printStackTrace();
			result = new ArrayList<AuthResource>();
		}
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		res.setModel(result);
		return res;
	}
	
	@Service(serviceName="getone")
	public ISwordResponse getOne(ISwordRequest req) {
		AuthResource result = null;
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			String[] ids = req.getDataMap().get("id");
			if (ids != null && ids.length > 0) {
				result = dao.findOneByPrimaryKey(AuthResource.class, ids[0]);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		res.setModel(result);
		return res;
	}
	
	@Service(serviceName="save")
	public ISwordResponse save(ISwordRequest req) {
		AuthResource result = null;
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			AuthResource res = new AuthResource();
			res.setResId(UUID.randomUUID().toString().replace("-", ""));
			res.setResName("test");
			res.setResPid("1");
			res.setResUrl("test");
			res.setResDesc("test");
			dao.insert(res);
		} catch (Exception e) {
			e.printStackTrace();
		}
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		return res;
	}
	
	@Service(serviceName="update")
	public ISwordResponse update(ISwordRequest req) {
		AuthResource resource = null;
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			String[] ids = req.getDataMap().get("id");
//			动态查询
//			dao.createCriteriaBuilder()
			if (ids != null && ids.length > 0) {
				resource = dao.findOneByPrimaryKey(AuthResource.class, ids[0]);
				resource.setResDesc("elva");
				dao.update(resource);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		return res;
	}
	
	@Service(serviceName="delete")
	public ISwordResponse delete(ISwordRequest req) {
		AuthResource resource = null;
		try{
			IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
			String[] ids = req.getDataMap().get("id");
			if (ids != null && ids.length > 0) {
				dao.deleteBatchByPrimaryKey(AuthResource.class, ids);
//				dao.deleteBatchByPrimaryKey(AuthResource.class, Arrays.asList(ids));
//				List<Object> list = new ArrayList<Object>();
//				for (String id : ids) {
//					list.add(id);
//				}
//				dao.deleteBatchByPrimaryKey(AuthResource.class, list);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		ISwordResponse res = SwordResponseFactory.createSwordResponseInstance(req);
		return res;
	}
	
}
