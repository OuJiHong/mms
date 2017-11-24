import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;
import java.sql.Date;
import java.util.Arrays;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.spel.SpelParserConfiguration;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;

import com.tmp.aop.InvokeProxyHandler;
import com.tmp.service.UserService;


/**
 * 
 * spring 上下文环境测试
 * 
 * @author Administrator
 *
 */
public class SpringTest {
	
	enum Product{
		p1,p2,p3,p4;//声明的枚举类型的所有对象
		
		
		public String toString(){
			return this.name();
		}
	}
	
	public static void main_001(String[] args) {
		//使用spring代理
		ClassPathXmlApplicationContext  context  = new ClassPathXmlApplicationContext("applicationContext.xml");
		UserService userService = context.getBean("userService", UserService.class);
		userService.add(null);
		
		//显示配置
		System.out.println("~~~:" + userService);
		//使用jdk代理,只能是接口代理
		InvocationHandler invocationHandler = new InvokeProxyHandler(userService);
		UserService userServiceProxy = (UserService)Proxy.newProxyInstance(userService.getClass().getClassLoader(), new Class<?>[]{UserService.class},invocationHandler);
		userServiceProxy.add(null);
		
		context.close();
		
	}
	
	/**
	 * 测试SPEL表达式
	 * @param args
	 */
	public static void main(String[] args){
		SpelParserConfiguration spelParserConfiguration = new SpelParserConfiguration(true,true);
		StandardEvaluationContext context = new StandardEvaluationContext();
		context.setVariable("systemProperties", System.getProperties());
		SpelExpressionParser spelExpressionParser = new SpelExpressionParser(spelParserConfiguration);
		Expression expression1 = spelExpressionParser.parseExpression("T(String).valueOf('asdfasd')");
		Expression expression2 = spelExpressionParser.parseExpression("new java.lang.String('2016-07-11')");
		Expression expression3 = spelExpressionParser.parseExpression("#systemProperties['user.home']");
		Expression expression4 = spelExpressionParser.parseExpression("'hh'.concat('0001')");
		System.out.println(expression1.getValue());
		System.out.println(expression2.getValue(Date.class).getTime());
		System.out.println(expression3.getValue(context));
		System.out.println(expression4.getValue());
		System.out.println(SpringTest.Product.p1.name() + "--" + Product.p1.getDeclaringClass() + "--" + Product.p1.ordinal());
		System.out.println(Product.p2.name() + "--" + Product.p2.getDeclaringClass() + "--" + Product.p2.ordinal());
		System.out.println(Arrays.toString(Product.values()));
	}
	

}
