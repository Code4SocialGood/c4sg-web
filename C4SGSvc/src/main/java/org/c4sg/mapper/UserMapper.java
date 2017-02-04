package org.c4sg.mapper;

import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapper extends ModelMapper {

	public UserDto getUserDtoFromEntity(User user){
		UserDto userDto = map(user, UserDto.class);
		return userDto;
	}
	
	public User getUserEntityFromDto(UserDto userDto){
		User user = map(userDto, User.class);
		return user;
	}
}
