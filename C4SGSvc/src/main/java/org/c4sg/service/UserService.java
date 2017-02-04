package org.c4sg.service;

import org.c4sg.entity.User;

import java.util.List;

public interface UserService {
    List<User> findAll();
    User findById(int id);
    User findByName(String name);

    List<User> findDevelopers();
}
