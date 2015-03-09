package com.css.sword.org.test;

import java.util.ArrayList;
import java.util.List;

import com.css.sword.kernel.base.annotation.Service;
import com.css.sword.kernel.base.annotation.ServiceContainer;
import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.base.persistence.IPersistenceService;
import com.css.sword.kernel.utils.SwordPersistenceUtils;
import com.css.sword.org.entity.OrgZw;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordResponseFactory;

@ServiceContainer
public class TestService {
	@Service(serviceName="demoSaveService")
	public ISwordResponse demoSaveService(ISwordRequest iReq) throws SwordBaseCheckedException{


		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
	   
		/*OrgZw zw = new OrgZw(); 

	    
		zw.setSort(10);
		zw.setZwCode("10023gg");
		zw.setZwName("yiying");
       boolean result = dao.insert(zw);*/
        /**
         * 根据请求从工厂构造出返回值，由用户向返回值中添加返回信息
         */
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		try {
			String sql = "select * from org_zw";
			List<Object> param = new ArrayList<Object>();
			param.add("ZW001");
			List<OrgZw> result = dao.findAll(sql, null ,OrgZw.class);
			dRes.setModel(result);
			//dRes.addAttribute("", "");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		/*if(result==true){
			dRes.setViewName("/successful.jsp");
		}else 
			dRes.setViewName("/failue.jsp");*/
		
		return dRes;
     //   assertTrue( true );
	}
}
