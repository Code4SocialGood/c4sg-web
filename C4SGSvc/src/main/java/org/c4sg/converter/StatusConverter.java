package org.c4sg.converter;

import java.util.Optional;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import org.c4sg.constant.Status;

@Converter
public class StatusConverter implements AttributeConverter<Status, String> {
	@Override
	public String convertToDatabaseColumn(Status s) {
		StringBuilder sb = new StringBuilder();
		sb.append(s.getValue());
		return sb.toString();
	}
	
	@Override
	public Status convertToEntityAttribute(String s) {
    	if(!Optional.ofNullable(s.toUpperCase()).isPresent()) 
        {
             return Status.PENDING;
        }
        return Status.valueOf(Status.class, Status.getStatus(s));
	}
}
