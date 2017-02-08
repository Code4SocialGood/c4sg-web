package org.c4sg.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.c4sg.constant.UserDisplay;
import org.c4sg.constant.UserRole;
import org.c4sg.constant.UserStatus;
import org.c4sg.dao.UserDao;
import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;
import org.c4sg.mapper.UserMapper;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserDao userDao;

    @Autowired
	private UserMapper userMapper;

    @Override
    public List<UserDto> findAll() {
		List<User> users = userDao.findAll();
		List<UserDto> userDtos = users.stream()
									.map(p -> userMapper.getUserDtoFromEntity(p))
									.collect(Collectors.toList());
		return userDtos;
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
    
    public void deleteUser(int id) {
    	User localUser = userDao.findById(id);

        if (localUser != null) {
        	localUser.setStatus(UserStatus.DELETED.getValue());
        	userDao.save(localUser);
        } 
    }
    
    public User updateUser(User user) {
    	User localUser = userDao.findById(user.getId());

        if (localUser != null) {
        	localUser = userDao.save(user);
        } 

        return localUser;
    }
    
}
