package org.c4sg.constant;

public enum UserProjectStatus {

    APPLIED("A");
    private final String value;

    UserProjectStatus(String value) {
        this.value = value;
    }

    public String getStatus(){
        return value;
    }
}
