import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.TypedQuery;

import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;


/**
 * hibernate 测试
 * @author Administrator
 *
 */
public class HibernateTest {
	
	
	/**
	 * 测试
	 * @param args
	 */
	public static void main(String[] args){
//		EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("jpa");
		LocalContainerEntityManagerFactoryBean entityManagerFactoryBean = new LocalContainerEntityManagerFactoryBean();
		entityManagerFactoryBean.setPersistenceXmlLocation("persistence.xml");
		entityManagerFactoryBean.afterPropertiesSet();
		System.out.println(entityManagerFactoryBean.getPersistenceUnitInfo());
		EntityManagerFactory entityManagerFactory = entityManagerFactoryBean.getObject();
		EntityManager entityManager  = entityManagerFactory.createEntityManager();
		System.out.println(entityManager);
		
		//person
		entityManager.getTransaction().begin();
		Person person = new Person();
		person.setName("lisi");
		
		entityManager.persist(person);
		
		//book
		Book book1 = new Book(null,"数学",22,"sss");
		Book book2 = new Book(null,"wenxu",33,"sss");
		Book book3 = new Book(null,"english",44,"sss");
		book1.setPerson(person);
		book2.setPerson(person);
		book3.setPerson(person);
		
		entityManager.persist(book1);
		entityManager.persist(book2);
		entityManager.persist(book3);
		
		entityManager.getTransaction().commit();
		
		System.out.println("添加完成：" + person);
	}
	
	
}
