package org.c4sg.constant;

public enum Status {

    STATUS_ACTIVE("A"), STATUS_PENDING("P"), STATUS_DELETED("D");

    private String value;

    Status(String value) {
        this.value = value;
    }

    public static Status getStatus(String status) {
        String currentStatus = status.toUpperCase();
        switch (currentStatus) {
            case "A":
                return STATUS_ACTIVE;
            case "P":
                return STATUS_PENDING;
            case "D":
                return STATUS_DELETED;
            default:
                return STATUS_ACTIVE;
        }
    }

    @Override
    public String toString() {
        return value;
    }
}
