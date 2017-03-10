package org.c4sg.constant;

public enum Directory {

	AVATAR_UPLOAD("avatars"), RESUME_UPLOAD("resumes"), LOGO_UPLOAD("logos");

	private String value;

	Directory(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

}
