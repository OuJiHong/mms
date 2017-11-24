import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;


@Entity
@Table(name="person")
public class Person implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8520812371545172460L;

	private Integer id;
	
	private String name;
	
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
	
	
}
