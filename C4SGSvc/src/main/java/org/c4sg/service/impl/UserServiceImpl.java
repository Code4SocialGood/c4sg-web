package org.c4sg.service.impl;

import org.c4sg.constant.Status;
import static org.c4sg.constant.Directory.RESUME_UPLOAD;
import static org.c4sg.constant.Directory.AVATAR_UPLOAD;
import static org.c4sg.constant.Format.RESUME;
import static org.c4sg.constant.Format.IMAGE;
import org.c4sg.constant.UserRole;
import org.c4sg.dao.UserDAO;
import org.c4sg.dao.specification.UserSpecification;
import org.c4sg.dto.UserDTO;
import org.c4sg.entity.User;
import org.c4sg.mapper.UserMapper;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public UserDTO findByEmail(String email) {
        return userMapper.getUserDtoFromEntity(userDAO.findByEmail(email));
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

    @Override
    public List<UserDTO> getApplicants(Integer projectId) {
        List<User> users = userDAO.findByUserProjectId(projectId);
        return userMapper.getDtosFromEntities(users);
    }

    @Override
    public List<UserDTO> search(String userName, String firstName, String lastName) {
        Map<String, Object> conditions = new HashMap<>();
        conditions.put("userName", userName);
        conditions.put("firstName", firstName);
        conditions.put("lastName", lastName);

        List<User> users = userDAO.findAll(new UserSpecification(conditions));
        return mapUsersToUserDtos(users);
    }

    private List<UserDTO> mapUsersToUserDtos(List<User> users) {
        return users.stream()
                .map(p -> userMapper.getUserDtoFromEntity(p))
                .collect(Collectors.toList());
    }

	@Override
	public String getAvatarUploadPath(Integer userId) {
		return AVATAR_UPLOAD.getValue() + File.separator + userId + IMAGE.getValue();
	}

	@Override
	public String getResumeUploadPath(Integer userId) {
		return RESUME_UPLOAD.getValue() + File.separator + userId + RESUME.getValue();
	}
}
