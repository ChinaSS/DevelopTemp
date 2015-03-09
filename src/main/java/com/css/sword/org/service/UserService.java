package com.css.sword.org.service;

import com.css.sword.kernel.base.annotation.Service;
import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.base.persistence.IPersistenceService;
import com.css.sword.kernel.utils.SwordPersistenceUtils;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;

public class UserService {
	
	//人员导入
	@Service(serviceName="importUser")
	public ISwordResponse importUser(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		
		try {
			
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
}
