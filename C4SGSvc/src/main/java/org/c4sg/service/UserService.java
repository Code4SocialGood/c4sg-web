
package org.c4sg.service;

import org.c4sg.dto.UserDTO;
import org.c4sg.entity.User;

import java.util.List;

public interface UserService {
	
    List<UserDTO> findAll();

    List<UserDTO> findActiveUsers();

    UserDTO findById(int id);

    UserDTO findByEmail(String email);

    List<User> findDevelopers();

    UserDTO saveUser(UserDTO userDTO);

    void deleteUser(Integer id);

    List<UserDTO> search(String userName, String firstName, String lastName);

    List<UserDTO> getApplicants(Integer projectId);
    
    String getAvatarUploadPath(Integer userId);
    
    String getResumeUploadPath(Integer userId);
}
