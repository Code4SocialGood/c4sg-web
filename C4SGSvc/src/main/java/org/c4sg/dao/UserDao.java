package org.c4sg.dao;

import org.c4sg.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface UserDao extends CrudRepository<User, Long>{
	
	public User findByName(String name);


}
