package org.c4sg.dao;

import org.c4sg.entity.User;

import java.util.List;

import org.c4sg.constant.UserDisplay;
import org.c4sg.constant.UserRole;
import org.springframework.data.repository.CrudRepository;

public interface UserDao extends CrudRepository<User, Long>{
	
	public User findByName(String name);
    List<User> findAll();
    User findById(int id);

    List<User> findByRoleAndDisplayFlagOrderByGithubDesc(UserRole role, UserDisplay display);
}
