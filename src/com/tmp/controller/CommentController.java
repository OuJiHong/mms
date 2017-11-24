package com.tmp.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tmp.entity.Comment;
import com.tmp.entity.Msg;
import com.tmp.entity.User;
import com.tmp.exception.BizException;
import com.tmp.form.TransMessage;
import com.tmp.service.CommentService;
import com.tmp.service.UserService;

/**
 * 
 * 
 * 朋友圈管理
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/comment")
public class CommentController extends BaseController{
	
	@Resource(name="userServiceImpl")
	private UserService userService;
	
	@Resource(name="commentServiceImpl")
	private CommentService commentService;
	
	/**
	 * 获取列表
	 * @return
	 */
	@RequestMapping("/list")
	public String list(){
		return "/comment/list";
	}
	
	
	/**
	 * 获取列表数据
	 * @return
	 */
	@RequestMapping("/listJson")
	@ResponseBody
	public List<Comment> listJson(){
		return commentService.list();
	}
	
	
	/**
	 * 添加
	 * @param user
	 * @return
	 */
	@RequestMapping(value="/addOrUpdate",method=RequestMethod.POST)
	@ResponseBody
	public TransMessage addOrUpdate(Comment comment) throws Exception{
		
		User publishUser = comment.getPublishUser();
		if(publishUser == null){
			throw new BizException("必须指定发布用户");
		}
		
		if(comment.getId() != null){
			Comment oldComment = commentService.find(comment.getId());
			BeanUtils.copyProperties(comment, oldComment,new String[]{"createDate","modifyDate","laudUsers","pertinenceComment","coverComments"});
			commentService.update(oldComment);
		}else{
			commentService.add(comment);
		}
		
		return TransMessage.SUCCESS;
	}
	
	
	/**
	 * 点赞
	 * @param id
	 * @param userId
	 * @return
	 */
	@RequestMapping(value="/addLaudUser",method=RequestMethod.POST)
	@ResponseBody
	public TransMessage addLaudUser(Long id, Long[] userId, Boolean isClear) throws Exception{
		Comment comment = commentService.find(id);
		List<User> userList = userService.findList(userId);
		if(userList.size() == 0){
			throw new BizException("必须指定点赞用户");
		}
		
		if(isClear != null && isClear){
			comment.getLaudUsers().clear();
		}
		comment.getLaudUsers().addAll(userList);
		commentService.update(comment);
		
		return TransMessage.SUCCESS;
	}
	
	/**
	 * 评论
	 * @param id
	 * @param userId
	 * @param content
	 * @return
	 */
	@RequestMapping(value="/addCoverComment",method=RequestMethod.POST)
	@ResponseBody
	public TransMessage addCoverComment(Long id, Long userId, String content)  throws Exception{
		Comment comment = commentService.find(id);
		User user = userService.find(userId);
		if(user == null){
			throw new BizException("必须指定评论用户");
		}
		
		Comment coverComment = new Comment();
		coverComment.setType(Comment.Type.comment);
		coverComment.setPublishUser(user);
		Msg msg = new Msg();
		msg.setTitle("replay - " + id);
		msg.setContent(content);
		coverComment.setMsg(msg);
		coverComment.setPertinenceComment(comment);
		commentService.add(coverComment);
		
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
		Comment comment = commentService.find(id);
		commentService.delete(comment);
		return TransMessage.SUCCESS;
	}
	
	
	
	/**
	 * 查询详情
	 * @param id
	 * @return
	 */
	@RequestMapping(value="/detail")
	@ResponseBody
	public Map<String,Object> detail(Long id){
		Comment comment = commentService.find(id);
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("id", comment.getId());
		map.put("type",comment.getType());
		map.put("msg", comment.getMsg());
		map.put("publishUser",comment.getPublishUser());
		map.put("laudUsers", comment.getLaudUsers());
		map.put("coverComments", comment.getCoverComments());
		return map;
	}
	
	
	/**
	 * 获取所有类型
	 * @return
	 */
	@RequestMapping(value="typeList")
	@ResponseBody
	public List<Map<String,Object>>  typeList(){
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		
		Map<String,Object> type0 = new HashMap<String,Object>();
		type0.put("value",Comment.Type.publish);
		type0.put("name","发布");
		
		Map<String,Object> type1 = new HashMap<String,Object>();
		type1.put("value",Comment.Type.comment);
		type1.put("name","评论");
		
		list.add(type0);
		list.add(type1);
		return list;
	}
	
	
	/**
	 * 查看朋友圈信息
	 * 
	 * @param id
	 * @param model
	 * @return
	 */
	@RequestMapping("/friendInfo")
	public String friendInfo(@RequestParam Long id, Model model){
		Comment comment  = commentService.find(id);
		User user = comment.getPublishUser();
		model.addAttribute("comment", comment);
		model.addAttribute("user", user);
		model.addAttribute("commentList",commentService.listPublish());
		
		return "/friend/friendInfo";
		
	}
	
	/**
	 * 查看朋友圈信息
	 * 
	 * @param id
	 * @param model
	 * @return
	 */
	@RequestMapping("/friendDetail")
	public String friendDetail(@RequestParam Long id,  Model model){
		Comment comment  = commentService.find(id);
		User user = comment.getPublishUser();
		model.addAttribute("comment", comment);
		model.addAttribute("user", user);
		return "/friend/friendDetail";
	}
	
	
}
