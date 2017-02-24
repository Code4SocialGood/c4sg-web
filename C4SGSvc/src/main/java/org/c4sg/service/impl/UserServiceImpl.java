package org.c4sg.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.c4sg.constant.Status;
import org.c4sg.constant.UserRole;
import org.c4sg.dao.UserDao;
import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;
import org.c4sg.mapper.UserMapper;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<UserDto> findAll() {
        List<UserDto> usersDto = new ArrayList<>();
        userDao.findAll().stream().forEach(user -> usersDto.add(userMapper.getUserDtoFromEntity(user)));
        return usersDto;

    }
    
    @Override
    public List<UserDto> findActiveUsers() {
        List<User> users = userDao.findByStatusOrderByUserNameAsc(Status.ACTIVE);
		List<UserDto> userDtos = users.stream()
									.map(p -> userMapper.getUserDtoFromEntity(p))
									.collect(Collectors.toList());
		return userDtos;
    }
    @Override
    public UserDto findById(int id) {
        return userMapper.getUserDtoFromEntity(userDao.findById(id));
    }

    @Override
    public User findByName(String name) {
        return null;
    }

    @Override
    public List<User> findDevelopers() {
        return userDao.findByRoleAndDisplayFlagOrderByGithubDesc(UserRole.C4SG_DEVELOPER, true);
    }

    @Override
    public UserDto saveUser(UserDto userDto) {
        User user = userMapper.getUserEntityFromDto(userDto);

        return userMapper.getUserDtoFromEntity(userDao.save(user));
    }

    @Override
    public void deleteUser(Integer id) {
        User user = userDao.findById(id);
        user.setStatus(Status.DELETED);

        userDao.save(user);
    }
    
}
