package org.c4sg.service;

import org.c4sg.dto.UserDTO;
import org.c4sg.entity.User;
import java.util.List;

public interface UserService {
	
    UserDTO findById(int id);
    User findByName(String name);
    UserDTO saveUser(UserDTO userDTO);
    void deleteUser(Integer id);
    List<UserDTO> findAll();
    List<UserDTO> findActiveUsers();
    List<User> findDevelopers();
    List<UserDTO> getApplicants(Integer projectId);
}
