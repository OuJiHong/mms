package com.tmp.service.impl;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.font.LineMetrics;
import java.awt.image.BufferedImage;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.math.RandomUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.tmp.service.CaptchaService;

/**
 * 验证码服务实现
 * @author OJH
 *
 */
@Service("captchaServiceImpl")
public class CaptchaServiceImpl implements CaptchaService{

	/**
	 * 验证码缓存名称
	 */
	public static final String CAPTCHA_CACHE_NAME = CaptchaServiceImpl.class.getName() + "_captcha"; 
			
	@Override
	public BufferedImage generateCaptcha() {
		int codeCount = 4;
		int fontSize = 20;
		int width = fontSize * (codeCount + 1);//多出一个字符的空间
		int height = 34;
		String captchaCode = RandomStringUtils.randomAlphabetic(4);
		ServletRequestAttributes requestAttribute = (ServletRequestAttributes)RequestContextHolder.currentRequestAttributes();
		requestAttribute.getRequest().getSession().setAttribute(CAPTCHA_CACHE_NAME, captchaCode);
		BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_BGR);
		Graphics2D graphics = bufferedImage.createGraphics();
		graphics.setBackground(Color.YELLOW);
		graphics.setColor(new Color(240,240,240));
		graphics.fillRect(0, 0, width, height);
		Font font = new Font(Font.SANS_SERIF, Font.PLAIN, fontSize);
		graphics.setFont(font);
		LineMetrics lineMetrics = font.getLineMetrics(captchaCode, graphics.getFontRenderContext());
		
		int startX = 8;
		int startY = (int)lineMetrics.getAscent() + ((height - (int)lineMetrics.getHeight()) / 2);
		//绘制随机线条
		for(int i = 0; i < 30; i++){
			graphics.setColor(createColor());
			drawLine(graphics, width, height);
		}
		
		for(int i = 0 ; i < captchaCode.length(); i++){
			String code = captchaCode.substring(i, i+1);
			graphics.setColor(createColor());
			graphics.drawString(code, startX, startY);
			startX += fontSize;
		}
		
		return bufferedImage;
	}

	@Override
	public boolean isValid(HttpServletRequest request, String captcha) {
		String cacheCaptchaCode = (String)request.getSession().getAttribute(CAPTCHA_CACHE_NAME);
		if(cacheCaptchaCode != null && cacheCaptchaCode.equalsIgnoreCase(captcha)){
			return true;
		}
		return false;
	}
	

	/**
	 * 创建随机颜色
	 * @return
	 */
	private Color createColor(){
		int r =  RandomUtils.nextInt(150);
		int g =  RandomUtils.nextInt(150);
		int b =  RandomUtils.nextInt(150);
		Color color = new Color(r,g,b);
		return color;
	}
	
	/**
	 * 绘制随机线条
	 * @param graphics
	 * @param maxWidth
	 * @param maxHeight
	 */
	private void drawLine(Graphics graphics, int maxWidth, int maxHeight){
		int x1 = RandomUtils.nextInt(maxWidth);
		int y1 = RandomUtils.nextInt(maxHeight);
		int x2 =  x1 + (RandomUtils.nextInt(20) - 10);//值差大小
		int y2 = y1 + (RandomUtils.nextInt(20) - 10);//值差大小
		graphics.drawLine(x1, y1, x2, y2);
	}
	
}
