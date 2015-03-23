package com.css.sword.extensions.fileupload;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.css.sword.web.controller.AbsSwordController;
import com.css.sword.web.controller.SwordController;

// TODO: Auto-generated Javadoc
/**
 * The Class FileUploadController.
 * 文件上传处理类~所有功能均封装到UploadServletHandler中！
 */
@SwordController("FileUploadController")
public class FileUploadController extends AbsSwordController {

	/* (non-Javadoc)
	 * @see com.css.sword.web.controller.AbsSwordController#doAction(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@Override
	public void doAction(HttpServletRequest request, HttpServletResponse response)
			throws Exception {
//		int majorVersion=request.getServletContext().getEffectiveMajorVersion();
//		UploadServletHandler.requestHandler(request, response,majorVersion);
	}

}
