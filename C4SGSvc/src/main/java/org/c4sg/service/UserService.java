package org.c4sg.service;

import org.c4sg.dto.UserDto;

public interface UserService {
	public UserDto createUser(UserDto userDto);

	public UserDto currentUser(UserDto userDto);
}
