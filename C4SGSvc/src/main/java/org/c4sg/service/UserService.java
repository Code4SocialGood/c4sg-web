package org.c4sg.service;

import java.util.List;

import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;

public interface UserService {
	
    List<UserDto> findAll();
    User findById(int id);
    User findByName(String name);

    List<User> findDevelopers();
    void deleteUser(int id);
    User updateUser(User user);
}
