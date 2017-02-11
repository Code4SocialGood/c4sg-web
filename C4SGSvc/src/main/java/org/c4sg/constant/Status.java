package org.c4sg.constant;

public enum Status {

    ACTIVE("A"), PENDING("P"), DELETED("D");

    private String value;

    Status(String value) {
        this.value = value;
    }

    public static Status getStatus(String status) {
        String currentStatus = status.toUpperCase();
        switch (currentStatus) {
            case "A":
                return ACTIVE;
            case "P":
                return PENDING;
            case "D":
                return DELETED;
            default:
                return ACTIVE;
        }
    }

    @Override
    public String toString() {
        return value;
    }
}
