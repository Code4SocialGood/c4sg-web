package org.c4sg.entity;




import com.vividsolutions.jts.geom.Point;
import org.c4sg.constant.UserDisplay;
import org.c4sg.constant.UserRole;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, updatable = false)
    private Integer id;
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
    @Column(name = "status", columnDefinition = "char(1)", nullable = false)
    private String status;
    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.ORDINAL)
    private UserRole role;
    @Column(name = "github", columnDefinition = "char(1)", nullable = false)
    private Integer github;
    @Column(name = "display_flag")
    @Enumerated(EnumType.ORDINAL)
    private UserDisplay displayFlag;
    @Column(name = "location", columnDefinition = "point")
    private Point location;


    public UserDisplay getDisplayFlag() {
        return displayFlag;
    }

    public void setDisplayFlag(UserDisplay displayFlag) {
        this.displayFlag = displayFlag;
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


    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
