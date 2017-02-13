package org.c4sg.constant;

import java.util.Optional;

public enum Status {

    ACTIVE("A"), PENDING("P"), DELETED("D");

    private String value;

    Status(String value) {
        this.value = value;
    }

    public String getValue() {
    	return value;
    }

    public static String getUserRole(String role) {
        if(!Optional.ofNullable(role).isPresent()) 
        {
            return PENDING.name();
        }
        else
        {
    		for (Status e : Status.values()) {
    			if (e.getValue() == role)
    			{
    				return e.name();
    			}	
    		}
    		return PENDING.name();
        }
     }
    @Override
    public String toString() {
        return value;
    }
}
