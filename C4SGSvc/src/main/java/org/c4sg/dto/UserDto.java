package org.c4sg.dto;

import java.util.Date;

public class UserDto {
   private int id;
   private String name;
   private String email;
   private String password;
   private String rpassword;
   private String phone;
   private String state;
   private String country;
   private String zip;
   private String status;
   private Date create_time;
   private Date change_time;
   private Date delete_time;
   
   
   
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
public Date getCreate_time() {
	return create_time;
}
public void setCreate_time(Date create_time) {
	this.create_time = create_time;
}
public Date getChange_time() {
	return change_time;
}
public void setChange_time(Date change_time) {
	this.change_time = change_time;
}
public Date getDelete_time() {
	return delete_time;
}
public void setDelete_time(Date delete_time) {
	this.delete_time = delete_time;
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
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}
public String getPassword() {
	return password;
}
public void setPassword(String password) {
	this.password = password;
}
public String getRpassword() {
	return rpassword;
}
public void setRpassword(String rpassword) {
	this.rpassword = rpassword;
}

   
   
}
