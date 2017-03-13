package org.c4sg.mapper.converter;

import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class BooleanToStringConverter extends AbstractConverter<Boolean, String> {
    @Override
    protected String convert(Boolean aBoolean) {
        if (!Optional.ofNullable(aBoolean).isPresent()) {
            return null;
        }
        return aBoolean ? "Y" : "N";
    }
}
