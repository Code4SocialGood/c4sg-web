package org.c4sg.service.impl;

import org.c4sg.constant.UserDisplay;
import org.c4sg.constant.UserRole;
import org.c4sg.dao.UserDao;
import org.c4sg.entity.User;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserDao userDao;


    @Override
    public List<User> findAll() {
        return null;
    }

    @Override
    public User findById(int id) {
        return userDao.findById(id);
    }

    @Override
    public User findByName(String name) {
        return null;
    }

    @Override
    public List<User> findDevelopers() {
        return userDao.findByRoleAndDisplayFlagOrderByGithubDesc(UserRole.C4SG_DEVELOPER, UserDisplay.DISPLAY_USER);
    }
}
