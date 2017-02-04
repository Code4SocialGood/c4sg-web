package org.c4sg.service.impl;


import java.util.Date;

import org.c4sg.dao.UserDao;
import org.c4sg.dto.OrganizationDto;
import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;
import org.c4sg.mapper.UserMapper;
import org.c4sg.constant.UserDisplay;
import org.c4sg.constant.UserRole;
import org.c4sg.dao.UserDao;
import org.c4sg.entity.User;

import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class UserServiceImpl implements UserService {


	@Autowired
	private UserDao userDao;
  
	
	@Autowired
	private UserMapper userMapper;

	    @Override
    public List<User> findAll() {
        return null;
    }

    @Override
    public User findById(int id) {
        return userDao.findById(id);
    }

  
    @Override
    public List<User> findDevelopers() {
        return userDao.findByRoleAndDisplayFlagOrderByGithubDesc(UserRole.C4SG_DEVELOPER, UserDisplay.DISPLAY_USER);
    }
	  public UserDto findByName(String name) {
	        return userMapper.getUserDtoFromEntity(userDao.findByName(name));
	    }

	
	@Override
	public UserDto createUser(UserDto userDto) {
		User user = userDao.findByName(userDto.getName());

        if (user != null) {
        	//TODO: return error message
        } else {
        	/***
        	 * To be removed once database columns(status, create_time, change_time, delete_time) are made null
        	 */
        	userDto.setStatus("1");
        	userDto.setCreate_time(new Date());
        	userDto.setChange_time(new Date());
        	userDto.setDelete_time(new Date());
            user = userDao.save(userMapper.getUserEntityFromDto(userDto));
        }

        return userMapper.getUserDtoFromEntity(user);
		
	}


	@Override
	public UserDto currentUser(UserDto userDto) {
		User currentUser = userDao.findByName(userDto.getName());

        if (currentUser != null) {
        	//To do:
               } else {
            	  boolean enabled = true;
            	  boolean accountNonExpired = true;
            	  boolean credentialsNonExpired = true;
            	  boolean accountNonLocked = true;
            	  /*
            	  return  new org.springframework.security.core.userdetails.User
            	           (user.getEmail(), 
            	             user.getPassword().toLowerCase(), enabled, accountNonExpired, 
            	             credentialsNonExpired, accountNonLocked, 
            	             getAuthorities(user.getRoles()));*/
            	   

        }

        return userMapper.getUserDtoFromEntity(currentUser);
	}

}
