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

	private static final String IMAGE_DIRECTORY = "app/images/project/";
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", nullable = false, updatable = false)
	private int id;
	
	@Column(name = "name", nullable = false)
	private String name;
	
	@Column(name = "organization_id", nullable = false)
	private String organizationId;
	
	@Column(name = "image", nullable = false)
	private String image;
	
	@Column(name = "description", nullable = false)
	private String description;
	
	@Column(name = "status", nullable = false)
	private String status;
	
	@Column(name = "create_time", nullable = false)
	private String createTime;
	
	@ManyToOne
	@JoinColumn(name="organization_id", insertable=false, updatable=false)
	private Organization organization;
	
	/*private String organizationName;*/
	
	public String getOrganizationId() {
		return organizationId;
	}
	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}
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
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
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
	/*public String getOrganizationName() {
		return organizationName;
	}
	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}*/	
	
}
