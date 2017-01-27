package org.c4sg.constant;

public enum OrganizationStatus {
    ORGANIZATION_STATUS_ACTIVE("A"), ORGANIZATION_STATUS_PENDING("P"), ORGANIZATION_STATUS_DELETED("D");
    private String value;
    OrganizationStatus(String value) {
        this.value = value;
    }
}
