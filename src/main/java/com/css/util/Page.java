package com.css.util;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.css.sword.core.kernel.base.dataElement.IValueObject;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.web.request.ISwordRequest;

public class Page {
	private int pageSize = 10;
	private int curPage = 1;
	public Page(ISwordRequest iReq){
		this.curPage = Integer.parseInt(iReq.getData("pageNumber"));
		this.pageSize = Integer.parseInt(iReq.getData("pageSize"));
	}
	
	public JSONObject getData(String sql,List<Object> param,Class<? extends IValueObject > cl) throws Exception{
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		@SuppressWarnings("rawtypes")
		List data = dao.findAllBySqlWithPaging(sql, param, this.curPage, this.pageSize, cl);
		//查询出总条数
		@SuppressWarnings("rawtypes")
		Map count = dao.findOneBySql("select COUNT(*) "+sql.substring(sql.indexOf("from")), param);
		
		JSONObject json = new JSONObject();
		json.put("allDataCount", count.get("count(*)"));
		json.put("curPageData", data);
		
		return json;
	}
	
}
