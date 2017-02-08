package org.c4sg.constant;

public enum UserStatus {

    PENDING("P"), ACTIVE("A"), DELETED("D");

    private String value;

    UserStatus(String value) {
        this.value = value;
    }

	public String getValue() {
		return value;
	}
}
