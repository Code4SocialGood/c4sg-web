package org.c4sg.dao;

import org.c4sg.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserDao extends CrudRepository<User, Long> {
    List<User> findAll();
    User findById(int id);

    List<User> findByRoleAndDisplayFlagOrderByGithubDesc(String role, String display);
}
