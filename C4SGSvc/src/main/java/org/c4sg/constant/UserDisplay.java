package org.c4sg.constant;

public enum UserDisplay {
    DONT_DISPLAY_USER("N"), DISPLAY_USER("Y");
    private String value;
    UserDisplay(String value) {
        this.value = value;
    }
}
