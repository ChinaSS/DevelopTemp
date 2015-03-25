package com.css.sword.auth.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.css.sword.auth.entity.AuthResource;
import com.css.sword.core.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.org.entity.OrgRole;
import com.css.sword.org.entity.OrgUser;
import com.css.sword.web.SwordWebServiceUtil;
import com.css.sword.web.response.SwordDefaultResponse;

/** 过滤器的执行顺序是按照注解中的filterName的值的字母排序执行的，这个不靠谱，所以生产环境下应该将filter配置改为手动在web.xml配置 */
@WebFilter(filterName="URLFilter", urlPatterns={"/sword/*"})
public class FilterAuth implements Filter {

    /**
     * Default constructor. 
     */
    public FilterAuth() {
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		System.out.println("权限过滤器销毁");
	}

	private List<String> ignoreUrl;
	
	private Logger logger = LoggerFactory.getLogger(FilterAuth.class);
	
	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpServletRequest = (HttpServletRequest)request;
		HttpServletResponse httpServletResponse = (HttpServletResponse)response;
		//判断是否为ignoreUrl
		String url = httpServletRequest.getRequestURI();
		if (ignore(url)) {
			chain.doFilter(request, response);
			return ;
		}
		//判断Session
		HttpSession session = httpServletRequest.getSession();
		OrgUser user = (OrgUser)session.getAttribute("user");
		if (user == null) { //说明用户还没有登录
//			if (isAjax(httpServletRequest)) {
//				PrintWriter writer = httpServletResponse.getWriter();
//				JSONObject jsonObject = new JSONObject();
//				jsonObject.put("code", "login");
//				writer.write(jsonObject.toJSONString());
//			} else {
//				httpServletResponse.sendRedirect("/DevelopTemp/login.html");
//				return ;
//			}
		} else { //已经登录
			//根据用户去查找角色信息
			try {
				SwordDefaultResponse swordResponse = (SwordDefaultResponse)SwordWebServiceUtil.callService("orgGetAllRole");
				List<OrgRole> roleList = (List<OrgRole>)swordResponse.getModel();
				List<String> roleIdList = new ArrayList<String>();
				for (OrgRole role : roleList) {
					roleIdList.add(role.getUuid());
				}
				List<String> urlList = new ArrayList<String>();
				swordResponse = (SwordDefaultResponse)SwordWebServiceUtil.callService("orgGetAllRole", roleIdList);
				List<AuthResource> resList = (List<AuthResource>)swordResponse.getModel();
				System.out.println(resList.size());
			} catch (SwordBaseCheckedException e) {
				e.printStackTrace();
			}
		}
		chain.doFilter(request, response);
	}

	//是不是要忽略的url
	private boolean ignore(String url) {
		boolean ignore = false;
		for (String u : ignoreUrl) {
			if (url.indexOf(u) != -1) {
				ignore = true;
				break;
			}
		}
		return ignore;
	}
	
	//判断是否为ajax请求
	private boolean isAjax(HttpServletRequest httpServletRequest) {
		String requestType = httpServletRequest.getHeader("X-Requested-With");
		return requestType != null ? true : false;
	}
	
	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		System.out.println("权限过滤器启动");
		this.ignoreUrl = new ArrayList<String>();
		this.ignoreUrl.add("/sword/login");
	}

}
