package org.c4sg.dao;

import java.util.List;

import org.c4sg.entity.Organization;
import org.springframework.data.repository.CrudRepository;

public interface OrganizationDao extends CrudRepository<Organization, Long> {
	
	Organization findByName(String name);
	List<Organization> findAll();

}
