package org.c4sg.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.c4sg.constant.Status;
import org.c4sg.constant.UserRole;
import org.c4sg.dao.UserDAO;
import org.c4sg.dto.UserDTO;
import org.c4sg.entity.User;
import org.c4sg.mapper.UserMapper;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDAO userDAO;

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<UserDTO> findAll() {
        List<UserDTO> usersDto = new ArrayList<>();
        userDAO.findAll().stream().forEach(user -> usersDto.add(userMapper.getUserDtoFromEntity(user)));
        return usersDto;

    }
    
    @Override
    public List<UserDTO> findActiveUsers() {
        List<User> users = userDAO.findByStatusOrderByUserNameAsc(Status.ACTIVE);
		List<UserDTO> userDTOS = users.stream()
									.map(p -> userMapper.getUserDtoFromEntity(p))
									.collect(Collectors.toList());
		return userDTOS;
    }
    @Override
    public UserDTO findById(int id) {
        return userMapper.getUserDtoFromEntity(userDAO.findById(id));
    }

    @Override
    public User findByName(String name) {
        return null;
    }

    @Override
    public List<User> findDevelopers() {
        return userDAO.findByRoleAndDisplayFlagOrderByGithubDesc(UserRole.C4SG_DEVELOPER, true);
    }

    @Override
    public UserDTO saveUser(UserDTO userDTO) {
        User user = userMapper.getUserEntityFromDto(userDTO);

        return userMapper.getUserDtoFromEntity(userDAO.save(user));
    }

    @Override
    public void deleteUser(Integer id) {
        User user = userDAO.findById(id);
        user.setStatus(Status.DELETED);

        userDAO.save(user);
    }
    
}
