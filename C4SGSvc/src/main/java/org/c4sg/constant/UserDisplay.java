package org.c4sg.constant;

public enum UserDisplay {

    DONT_DISPLAY_USER("N"), DISPLAY_USER("Y");

    private String value;

    UserDisplay(String value) {
        this.value = value;
    }

    public static UserDisplay getUserDisplay(String userDisplay) {
        String currentUserDisplay = userDisplay.toUpperCase();
        switch (currentUserDisplay) {
            case "N":
                return DONT_DISPLAY_USER;
            case "Y":
                return DISPLAY_USER;
            default:
                return DONT_DISPLAY_USER;
        }
    }

    @Override
    public String toString() {
        return value;
    }
}
