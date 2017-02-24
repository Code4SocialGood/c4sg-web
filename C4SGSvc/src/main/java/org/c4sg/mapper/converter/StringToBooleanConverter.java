package org.c4sg.mapper.converter;

import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class StringToBooleanConverter extends AbstractConverter<String, Boolean> {
    @Override
    protected Boolean convert(String s) {
        if (Optional.ofNullable(s).isPresent()) {
            return s.equalsIgnoreCase("Y");
        }
        return null;
    }
}
