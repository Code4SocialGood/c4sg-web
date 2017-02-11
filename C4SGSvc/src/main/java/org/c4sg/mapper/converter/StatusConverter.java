package org.c4sg.mapper.converter;

import org.c4sg.constant.Status;
import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class StatusConverter extends AbstractConverter<String, Status> {
    @Override
    protected Status convert(String s) {
        if (!Optional.ofNullable(s).isPresent()) {
            return null;
        }
        return Status.getStatus(s);
    }
}
