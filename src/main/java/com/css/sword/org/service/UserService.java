package com.css.sword.org.service;

import java.util.ArrayList;
import java.util.List;

import com.css.sword.core.kernel.base.annotation.Service;
import com.css.sword.core.kernel.base.annotation.ServiceContainer;
import com.css.sword.core.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.core.kernel.base.persistence.IPersistenceService;
import com.css.sword.core.kernel.utils.SwordPersistenceUtils;
import com.css.sword.org.entity.OrgUser;
import com.css.sword.web.SwordWebServiceUtil;
import com.css.sword.web.request.ISwordRequest;
import com.css.sword.web.response.ISwordResponse;
import com.css.sword.web.response.SwordDefaultResponse;
import com.css.sword.web.response.SwordResponseFactory;
import com.css.util.Page;

@ServiceContainer("org/user")
public class UserService {
	
	//人员导入
	@Service("importUser")
	public ISwordResponse importUser(ISwordRequest iReq,List<OrgUser> list) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			dao.insertBatch(list);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	//根据所属部门id查询出人员列表
	@Service("getUserByDeptId")
	public ISwordResponse getUserByDeptId(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select * from org_user where dept_id=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("dept_id"));
			List<OrgUser> result = dao.findAllBySql(sql, param ,OrgUser.class);
			dRes.setModel(result);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	
	//分页查询，根据部门id，查询出人员列表
	@Service("getUserByDeptIdPage")
	public ISwordResponse getUserByDeptIdPage(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);
		try {
			String sql = "select * from org_user where dept_id=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("dept_id"));
			dRes.setModel(new Page(iReq).getData(sql, param, OrgUser.class));
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//获取人员列表，带分页
	@Service("getAllUserPage")
	public ISwordResponse getAllUserPage(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select * from org_user";
			dRes.setModel(new Page(iReq).getData(sql, null, OrgUser.class));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//根据所属人员id查询出人员
	@Service("getUserById")
	public ISwordResponse getUserById(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			String sql = "select * from org_user where user_code=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("user_code"));
			OrgUser user = dao.findOneBySql(sql, param, OrgUser.class);
			dRes.setModel(user);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
	
	//模糊查询人员
	@Service("getUserMh")
	public ISwordResponse getUserMh(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			List<Object> param = new ArrayList<Object>();
			StringBuffer sb = new StringBuffer("select * from org_user where");
			String user_code = iReq.getData("user_code");
			String user_name = iReq.getData("user_name");
			String dept_name = iReq.getData("dept_name");
			
			
			if(user_code!=null){
				sb.append("or user_code like ?");
				param.add("%"+user_code+"%");
			}
			if(user_name!=null){
				sb.append(" or user_name like ?");
				param.add("%"+user_name+"%");
			}
			if(dept_name!=null){
				sb.append(" or dept_name like ?");
				param.add("%"+dept_name+"%");
			}
			if(sb.toString().indexOf("like")==-1){
				sb.append(" 1=1");
				param = null;
			}
			
			List<OrgUser> result = dao.findAllBySql(sb.toString().replace("where or", "where"), param ,OrgUser.class);
			dRes.setModel(result);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
		
	//根据人员id,获取到所有人员的组合信息
	@Service("getUserAllDemo")
	public ISwordResponse getUserAllDemo(ISwordRequest iReq) throws SwordBaseCheckedException{
		
		//IPersistenceService dao = SwordPersistenceUtils.getPersistenceService();
		ISwordResponse dRes = SwordResponseFactory.createSwordResponseInstance(iReq);

		try {
			/*String sql = "select * from org_user where user_code=?";
			List<Object> param = new ArrayList<Object>();
			param.add(iReq.getData("user_code"));
			OrgUser user = dao.findOneBySql(sql, param, OrgUser.class);*/
			SwordDefaultResponse dResNew = SwordWebServiceUtil.callService("orgGetUserById",iReq);
			dRes.setModel(dResNew.getModel());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return dRes;
	}
}
