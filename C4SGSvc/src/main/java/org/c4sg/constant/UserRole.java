package org.c4sg.constant;

public enum UserRole {

    VOLUNTEER("V"), ORGANIZATION("O"), C4SG_ADMIN("C"), C4SG_DEVELOPER("D");

    private String value;

    UserRole(String value) {
        this.value = value;
    }

    public static UserRole getUserRole(String role) {
        String currentRole = role.toUpperCase();
        switch (currentRole) {
            case "V":
                return VOLUNTEER;
            case "O":
                return ORGANIZATION;
            case "C":
                return C4SG_ADMIN;
            case "D":
                return C4SG_DEVELOPER;
            default:
                return VOLUNTEER;
        }
    }

    @Override
    public String toString() {
        return value;
    }
}
