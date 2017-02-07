package org.c4sg.mapper.converter;

import org.c4sg.constant.UserRole;
import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

@Component
public class UserRoleConverter extends AbstractConverter<String, UserRole> {
    @Override
    protected UserRole convert(String s) {
        return UserRole.getUserRole(s);
    }
}
