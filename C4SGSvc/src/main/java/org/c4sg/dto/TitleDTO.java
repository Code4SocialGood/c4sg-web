package org.c4sg.dto;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;

public class TitleDTO {
	@NotNull
	private Integer id;
	
	@NotNull
	@Length(max = 100)
	private String title;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
}