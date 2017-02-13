package org.c4sg.mapper.converter;

import java.util.Optional;
import org.c4sg.constant.UserRole;
import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

@Component
public class UserRoleConverter extends AbstractConverter<String, UserRole> {
    @Override
    protected UserRole convert(String s) {
        if(!Optional.ofNullable(s.toUpperCase()).isPresent()) 
        {
            return UserRole.VOLUNTEER;
        }
    	return UserRole.valueOf(UserRole.class, UserRole.getUserRole(s));
    }
}
