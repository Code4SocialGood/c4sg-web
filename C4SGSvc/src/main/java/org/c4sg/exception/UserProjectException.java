package org.c4sg.exception;

public class UserProjectException extends Exception{
    private String errorMessage;

    public UserProjectException() {
        super();
    }

    public UserProjectException(String errorMessage) {
        super(errorMessage);
        this.errorMessage = errorMessage;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}
