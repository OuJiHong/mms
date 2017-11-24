import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;


/**
 * @author Administrator
 *
 */
@Entity
@Table(name="book")
public class Book implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -2042981129850064211L;
	
	
	private Integer id;
	private String name;
	private Integer age;
	private String address;
	
	private Person person;
	
	
	public Book() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Book(Integer id) {
		super();
		this.id = id;
	}
	
	public Book(Integer id, String name, Integer age, String address) {
		super();
		this.id = id;
		this.name = name;
		this.age = age;
		this.address = address;
	}
	
	@Id
	@GeneratedValue(generator="idAuto")
	@GenericGenerator(name="idAuto",strategy="increment")
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getAge() {
		return age;
	}
	public void setAge(Integer age) {
		this.age = age;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	
	@Transient
	@ManyToOne
	@JoinColumn(name="person_id")
	public Person getPerson() {
		return person;
	}

	public void setPerson(Person person) {
		this.person = person;
	}

	@Override
	public String toString() {
		return "Book [id=" + id + ", name=" + name + ", age=" + age
				+ ", address=" + address + "]";
	}
	
	
	
}
