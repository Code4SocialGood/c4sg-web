package org.c4sg.dao;

import java.util.List;

import org.c4sg.constant.UserDisplay;
import org.c4sg.constant.UserRole;
import org.c4sg.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface UserDao extends CrudRepository<User, Long> {
    List<User> findAll();
    //temporary until create date is added
    List<User> findByStatusOrderByUsernameAsc(String status);
    User findById(int id);

    List<User> findByRoleAndDisplayFlagOrderByGithubDesc(UserRole role, UserDisplay display);
    
}
