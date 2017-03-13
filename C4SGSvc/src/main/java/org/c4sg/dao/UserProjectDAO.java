package org.c4sg.dao;

import java.util.List;

import org.c4sg.entity.UserProject;
import org.springframework.data.repository.CrudRepository;

public interface UserProjectDAO extends CrudRepository<UserProject, Long>{
    UserProject findByUser_IdAndProject_Id(Integer userId, Integer projectId);
    List<UserProject> findByUserId(Integer userId);
}
