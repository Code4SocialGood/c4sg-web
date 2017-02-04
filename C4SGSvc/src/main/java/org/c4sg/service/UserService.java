package org.c4sg.service;


import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;

import java.util.List;

public interface UserService {
	public UserDto createUser(UserDto userDto);

	public UserDto currentUser(UserDto userDto);
  
  List<User> findAll();
  User findById(int id);
  UserDto findByName(String name);

  List<User> findDevelopers();

}
