package com.tmp.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

/**
 * 
 * 基础控制器
 * @author Administrator
 *
 */
public class BaseController {
	
	
	@InitBinder
	public void initDataBinder(WebDataBinder dataBinder){
		dataBinder.registerCustomEditor(Date.class, new CustomDateEditor(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"), false));
		dataBinder.registerCustomEditor(String.class, new StringTrimmerEditor(false));
	}
	
}
