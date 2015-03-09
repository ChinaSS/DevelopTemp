package com.css.sword.org.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.css.sword.web.SwordServiceUtil;
import com.css.sword.web.controller.AbsSwordController;
import com.css.sword.web.controller.SwordController;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.request.SwordDefaultRequest;
import com.css.sword.web.response.SwordDefaultResponse;


// /sword/serviceName && 
@SwordController("ExcelImportController")
public class ExcelImportController extends AbsSwordController {
	@Override
	public void doAction(HttpServletRequest request, HttpServletResponse response) throws Exception {
		// TODO Auto-generated method stub
		
		//得到excel，
		System.out.println(request.getParameter("formData"));
		
		
		/*SwordDefaultRequest iReq = new SwordDefaultRequest(request);
		SwordDefaultResponse swordRes = SwordServiceUtil.callService(iReq.getServiceName());
		this.writeToPage(response, swordRes.getModel());*/
	}

}
