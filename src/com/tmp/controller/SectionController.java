package com.tmp.controller;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.font.LineMetrics;
import java.awt.image.BufferedImage;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tmp.service.UserService;

/**
 * 通过注解标注的
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/section")
public class SectionController {
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("/page")
	@ResponseBody
	public Map<String,Object> page(){
		System.out.println("section：" + userService);
		Map<String,Object> m = new HashMap<String,Object>();
		m.put("tt","响应的是一个字符内容PAGE");
		return m;
	}
	
	/**
	 * 验证码
	 * @return
	 */
	@RequestMapping("/randomCode")
	@ResponseBody
	public BufferedImage randomCode(){
		BufferedImage bufferedImage = new BufferedImage(120, 80, BufferedImage.TYPE_3BYTE_BGR);
		Graphics2D graphics = bufferedImage.createGraphics();
		graphics.setColor(Color.gray);
		graphics.drawRect(0, 0, bufferedImage.getWidth(), bufferedImage.getHeight());
		graphics.setColor(Color.red);
		graphics.setFont(new Font("sans-serif", Font.BOLD, 24));
		String str = "123456";
		FontMetrics metrics = graphics.getFontMetrics();
		LineMetrics line = metrics.getLineMetrics(str, graphics);
		int fixedWidth = metrics.stringWidth(str);
		int baseLineSize = (int)line.getUnderlineOffset();
		int  offsetX = (bufferedImage.getWidth() - fixedWidth) / 2;
		int  offsetY = (bufferedImage.getHeight() / 2 );
		graphics.drawLine(0, offsetY + baseLineSize, bufferedImage.getWidth(), offsetY + baseLineSize);
		graphics.drawString(str, offsetX, offsetY);
		graphics.dispose();
		bufferedImage.flush();
		return bufferedImage;
	}
	
}
