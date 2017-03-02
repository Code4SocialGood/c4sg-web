package org.c4sg.controller;

import org.c4sg.dto.MessageDTO;
import org.c4sg.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

public class GenericController {

    @CrossOrigin
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NotFoundException.class)
    public MessageDTO exception(NotFoundException e) {
        return new MessageDTO(e.getMessage());
    }
}
