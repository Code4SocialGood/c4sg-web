package org.c4sg.constant;

public enum Format {

	IMAGE("avatars"), RESUME("resumes");

	private String value;

	Format(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
