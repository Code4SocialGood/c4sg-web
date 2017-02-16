package org.c4sg.converter;

import java.util.Optional;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import org.c4sg.constant.UserRole;

@Converter
public class UserRoleConverter implements AttributeConverter<UserRole, String> {
	@Override
	public String convertToDatabaseColumn(UserRole s) {
		return s.getValue();
	}
	@Override
	public UserRole convertToEntityAttribute(String s) {
    	if(!Optional.ofNullable(s.toUpperCase()).isPresent()) 
        {
             return UserRole.VOLUNTEER;
        }
        return UserRole.valueOf(UserRole.class, UserRole.getUserRole(s));
	}
}
