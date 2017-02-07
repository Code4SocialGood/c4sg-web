package org.c4sg.mapper.converter;

import org.c4sg.constant.UserDisplay;
import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

@Component
public class UserDisplayConverter extends AbstractConverter<String, UserDisplay> {
    @Override
    protected UserDisplay convert(String s) {
        return UserDisplay.getUserDisplay(s);
    }
}
