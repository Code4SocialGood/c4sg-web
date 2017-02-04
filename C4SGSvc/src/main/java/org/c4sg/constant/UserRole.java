package org.c4sg.constant;

public enum UserRole {

    VOLUNTEER("V"), ORGANIZATION("O"), C4SG_ADMIN("C"), C4SG_DEVELOPER("D");

    private String value;

    UserRole(String value) {
        this.value = value;
    }

}
