package org.c4sg.mapper;

import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;
import org.c4sg.mapper.converter.BooleanToStringConverter;
import org.c4sg.mapper.converter.StatusConverter;
import org.c4sg.mapper.converter.StringToBooleanConverter;
import org.c4sg.mapper.converter.UserRoleConverter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;

@Component
public class UserMapper extends ModelMapper {

    @Autowired
    private UserRoleConverter userRoleConverter;

    @Autowired
    private StringToBooleanConverter stringToBooleanConverter;

    @Autowired
    private BooleanToStringConverter booleanToStringConverter;

    @Autowired
    private StatusConverter statusConverter;

    @PostConstruct
    private void init() {

        PropertyMap<User, UserDto> userDtoPropertyMap = new PropertyMap<User, UserDto>() {
            @Override
            protected void configure() {
                map(source.getRole()).setRole(null);
                using(booleanToStringConverter).map(source.getDisplayFlag()).setDisplayFlag(null);
                map(source.getStatus()).setStatus(null);
                map(source.getLocation().getX()).setLatitude(null);
                map(source.getLocation().getY()).setLongitude(null);
            }
        };

        PropertyMap<UserDto, User> userPropertyMap = new PropertyMap<UserDto, User>() {
            @Override
            protected void configure() {
                using(userRoleConverter).map(source.getRole()).setRole(null);
                using(stringToBooleanConverter).map(source.getDisplayFlag()).setDisplayFlag(null);
                using(statusConverter).map(source.getStatus()).setStatus(null);
//                @todo create point from dto lat/long
//                Point point = new Point();
//                map().setLocation(point);
            }
        };
        addMappings(userDtoPropertyMap);
        addMappings(userPropertyMap);
    }

    public UserDto getUserDtoFromEntity(User user) {
        return map(user, UserDto.class);
    }

    public User getUserEntityFromDto(UserDto userDto) {
        return map(userDto, User.class);
    }
}
