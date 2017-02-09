package org.c4sg.constant;

import java.util.Optional;

public enum UserRole {

    VOLUNTEER("V"), ORGANIZATION("O"), C4SG_ADMIN("C"), C4SG_DEVELOPER("D");

    private String value;

    UserRole(String value) {
        this.value = value;
    }

    public static UserRole getUserRole(String role) {
        if(!Optional.ofNullable(role).isPresent()) {
            return VOLUNTEER;
        }
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
