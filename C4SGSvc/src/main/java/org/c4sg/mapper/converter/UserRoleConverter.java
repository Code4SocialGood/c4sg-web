package org.c4sg.mapper.converter;

import org.c4sg.constant.UserRole;
import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserRoleConverter extends AbstractConverter<String, UserRole> {
    @Override
    protected UserRole convert(String s) {
        if (!Optional.ofNullable(s).isPresent()) {
            return null;
        }
        return UserRole.getUserRole(s);
    }
}
