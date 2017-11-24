package com.tmp.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tmp.entity.User;
import com.tmp.form.TransMessage;
import com.tmp.service.UserService;

/**
 * 用户管理
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/user")
public class UserController extends BaseController{

	@Resource(name="userServiceImpl")
	private UserService userService;

	/**
	 * 获取列表
	 * @return
	 */
	@RequestMapping("/list")
	public String list(){
		return "/user/list";
	}
	
	
	/**
	 * 获取列表数据
	 * @return
	 */
	@RequestMapping("/listJson")
	@ResponseBody
	public List<User> listJson(){
		return userService.list();
	}
	
	
	/**
	 * 添加
	 * @param user
	 * @return
	 */
	@RequestMapping(value="/addOrUpdate",method=RequestMethod.POST)
	@ResponseBody
	public TransMessage addOrUpdate(@Valid User user){
		if(user.getId() != null){
			User oldUser = userService.find(user.getId());
			BeanUtils.copyProperties(user, oldUser,new String[]{"createDate","modifyDate"});
			userService.update(oldUser);
		}else{
			userService.add(user);
		}
		
		return TransMessage.SUCCESS;
	}
	
	
	
	/**
	 * 删除
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/delete",method=RequestMethod.POST)
	@ResponseBody
	public TransMessage delete(Long id){
		User user = userService.find(id);
		userService.delete(user);
		return TransMessage.SUCCESS;
	}
	
	
	
}
