package org.c4sg.mapper.converter;

import java.util.Optional;

import org.c4sg.constant.Status;
import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

@Component
public class StatusConverter extends AbstractConverter<String, Status> {
    @Override
    protected Status convert(String s) {
    	if(!Optional.ofNullable(s.toUpperCase()).isPresent()) 
        {
             return Status.PENDING;
        }
        return Status.valueOf(Status.class, Status.getStatus(s));
    }
}
