package org.c4sg.dao;

import java.util.List;

import org.c4sg.entity.Project;
import org.springframework.data.repository.CrudRepository;

public interface ProjectDao extends CrudRepository<Project, Long> {
	
	List<Project> findAll();
	Project findById(int id);
	Project findByName(String name);
	List<Project> findByOrganizationId(String keyWord);

}
