package org.c4sg.entity;

import org.c4sg.constant.Status;
import org.c4sg.converter.StatusConverter;

import javax.persistence.*;

@Entity
public class Organization {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false, updatable = false)
	private Integer id;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "url")
	private String url;

	@Column(name = "logo")
	private String logo;

	@Column(name = "description", nullable = false)
	private String description;

	@Column(name = "address1", nullable = false)
	private String address1;

	@Column(name = "address2")
	private String address2;

	@Column(name = "state")
	private String state;

	@Column(name = "country", nullable = false)
	private String country;
	
	@Convert(converter = StatusConverter.class)
	@Column(name = "status",nullable = false)
	private Status status;

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

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAddress1() {
		return address1;
	}

	public void setAddress1(String address1) {
		this.address1 = address1;
	}

	public String getAddress2() {
		return address2;
	}

	public void setAddress2(String address2) {
		this.address2 = address2;
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

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}
}