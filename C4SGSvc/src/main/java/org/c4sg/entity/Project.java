package org.c4sg.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Project {

	private static final String IMAGE_DIRECTORY = "assets/project/";

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false, updatable = false)
	private Integer id;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "image", nullable = false)
	private String image;

	@Column(name = "description", nullable = false)
	private String description;

	@Column(name = "status", columnDefinition="char(1)",nullable = false)
	private String status;

	@Column(name = "contact_email", nullable = false)
	private String email;

	@ManyToOne
	@JoinColumn(name = "organization_id", insertable = false, updatable = false)
	private Organization organization;

	public String getImage() {
		return IMAGE_DIRECTORY + image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Organization getOrganization() {
		return organization;
	}

	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
