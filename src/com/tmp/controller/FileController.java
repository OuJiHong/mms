package com.tmp.controller;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletContext;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.multipart.MultipartFile;

import com.tmp.util.SpringUtils;

/**
 * 上传控制
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/file")
public class FileController extends BaseController implements ServletContextAware{
	
	/**
	 * 必须预先存在
	 * 
	 */
	public static String basePath = "/upload";
	
	/**
	 * 自动注入的servlet上下文 
	 */
	private ServletContext servletContext;
	
	/**
	 * 上传
	 * @return
	 */
	@RequestMapping(value="/upload",method=RequestMethod.POST)
	@ResponseBody
	public Map<String,Object> upload(MultipartFile file) throws Exception{
		Map<String,Object> data = new HashMap<String,Object>();
		String filename = file.getOriginalFilename();
		String realPath = this.servletContext.getRealPath(basePath);
		File saveFile = new File(realPath,UUID.randomUUID() + "." + FilenameUtils.getExtension(filename));
		file.transferTo(saveFile);
		data.put("error","0");
		data.put("url",basePath + "/" + saveFile.getName());
		return data;
	}

	@Override
	public void setServletContext(ServletContext servletContext) {
		this.servletContext = servletContext;
	}
	
	
}
