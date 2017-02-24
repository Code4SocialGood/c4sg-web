package org.c4sg.service;

import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;
import java.util.List;

public interface UserService {
	
    List<UserDto> findAll();
    List<UserDto> findActiveUsers();
    UserDto findById(int id);
    User findByName(String name);

    List<User> findDevelopers();

    UserDto saveUser(UserDto userDto);

    void deleteUser(Integer id);
}
