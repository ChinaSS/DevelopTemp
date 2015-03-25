package com.css.sword.org.controller;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.css.sword.web.SwordWebServiceUtil;
import com.css.sword.web.controller.AbsSwordController;
import com.css.sword.web.controller.SwordController;
import com.css.sword.web.request.SwordDefaultRequest;
import com.css.sword.web.response.SwordDefaultResponse;
import com.css.util.ExcelToEntityList;


@SwordController("ExcelImportController")
public class ExcelImportController extends AbsSwordController {
	@Override
	public void doAction(HttpServletRequest request, HttpServletResponse response){
		// TODO Auto-generated method stub
		String status = "success";
		ExcelToEntityList excel = null;
		List<?> list = null;
		Object importInfo = null;
		try {
			@SuppressWarnings("unchecked")
			HashMap<String, String> param = JSON.parseObject(request.getParameter("formData"), HashMap.class);
			excel = new ExcelToEntityList();
			list = excel.transform(param, request.getPart("file").getInputStream());
			SwordDefaultRequest iReq = new SwordDefaultRequest(request);
			SwordDefaultResponse swordRes = SwordWebServiceUtil.callService(iReq.getServiceName(),iReq,list);
			importInfo = swordRes.getModel()==null?"":swordRes.getModel();
		}catch (Exception e) {
			// TODO Auto-generated catch block
			status = "exception";
			e.printStackTrace();
		}finally{
			try {
				String excelTransformInfo = "";
				if (excel.hasError()){
					excelTransformInfo = URLEncoder.encode(excel.getError().toString(),"utf-8");
				}
				//String result = "{\"status\":\""+status+"\",\"excelTransformInfo\":\""+excelTransformInfo+"\",\"count\":\""+(list!=null?list.size():"0")+"\",\"importInfo\":\""+URLEncoder.encode(importInfo.toString(), "UTF-8")+"\"}";
				
				String result = "{\"status\":\""+status+"\",\"excelTransformInfo\":\""+excelTransformInfo+"\",\"count\":\""+(list!=null?list.size():"0")+"\",\"importInfo\":\""+importInfo.toString()+"\"}";
				response.setContentType("application/json");
				this.writeToPage(response, result);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
