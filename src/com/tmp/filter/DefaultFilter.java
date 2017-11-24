package com.tmp.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Servlet Filter implementation class DefaultFilter
 */
public class DefaultFilter implements Filter {
	
	private static Log logger = LogFactory.getLog(DefaultFilter.class);
	
    /**
     * 
     * Default constructor. 
     */
    public DefaultFilter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		logger.info("初始请求编码：" + request.getCharacterEncoding());
		logger.info("初始响应编码：" + response.getCharacterEncoding());
		// pass the request along the filter chain
		//response.setContentLength(8000);//设置之后写入数据就不会更改
		
		chain.doFilter(request, response);
		logger.info("修改过的请求编码：" + request.getCharacterEncoding());
		logger.info("修改过的响应码：" + response.getCharacterEncoding());
		
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
