package org.c4sg.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.c4sg.constant.Status;
import org.c4sg.constant.UserRole;
import org.c4sg.converter.StatusConverter;
import org.c4sg.converter.UserRoleConverter;

import com.vividsolutions.jts.geom.Point;

@Entity
@Table(name = "user")
public class User implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 2014_04_17_001L;

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, updatable = false)
    private Integer id;
    @Column(name = "user_name", nullable = false)
    private String userName;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "email", nullable = false)
    private String email;
    @Column(name = "phone", nullable = false)
    private String phone;
    @Column(name = "state", nullable = false)
    private String state;
    @Column(name = "country", nullable = false)
    private String country;
    @Column(name = "zip", nullable = false)
    private String zip;
    
    @Convert(converter = StatusConverter.class)
    @Column(name = "status", nullable = false)
    private Status status;
    
    @Convert(converter = UserRoleConverter.class)
    @Column(name = "role", nullable = false)
    private UserRole role;
    
    @Column(name = "github", columnDefinition = "char(1)", nullable = false)
    private Integer github;
    @Column(name = "display_flag")
    private Boolean displayFlag;
 
    @Column(name = "location", columnDefinition = "point")
    private Point location;
    
    @Column(name = "introduction",nullable = true)
    private String introduction;
    
    @Column(name = "linked_inurl",nullable = true)
    private String linked_inurl;
    @Column(name = "personal_web_site",nullable = true)
    private String personal_web_site;
    @Column(name = "resume",nullable = true)
    private String resume;
    @Column(name = "skill1",nullable = true)
    private String skill1;
    @Column(name = "skill2",nullable = true)
    private String skill2;
    @Column(name = "skill3",nullable = true)
    private String skill3;
    @Column(name = "skill4",nullable = true)
    private String skill4;
    public String getIntroduction() {
		return introduction;
	}

	public void setIntroduction(String introduction) {
		this.introduction = introduction;
	}

	public String getLinked_inurl() {
		return linked_inurl;
	}

	public void setLinked_inurl(String linked_inurl) {
		this.linked_inurl = linked_inurl;
	}

	public String getPersonal_web_site() {
		return personal_web_site;
	}

	public void setPersonal_web_site(String personal_web_site) {
		this.personal_web_site = personal_web_site;
	}

	public String getResume() {
		return resume;
	}

	public void setResume(String resume) {
		this.resume = resume;
	}

	public String getSkill1() {
		return skill1;
	}

	public void setSkill1(String skill1) {
		this.skill1 = skill1;
	}

	public String getSkill2() {
		return skill2;
	}

	public void setSkill2(String skill2) {
		this.skill2 = skill2;
	}

	public String getSkill3() {
		return skill3;
	}

	public void setSkill3(String skill3) {
		this.skill3 = skill3;
	}

	public String getSkill4() {
		return skill4;
	}

	public void setSkill4(String skill4) {
		this.skill4 = skill4;
	}

	public String getSkill5() {
		return skill5;
	}

	public void setSkill5(String skill5) {
		this.skill5 = skill5;
	}

	@Column(name = "skill5",nullable = true)
    private String skill5;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public Integer getGithub() {
        return github;
    }

    public void setGithub(Integer github) {
        this.github = github;
    }

    public Boolean getDisplayFlag() {
        return displayFlag;
    }

    public void setDisplayFlag(Boolean displayFlag) {
        this.displayFlag = displayFlag;
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }
}
