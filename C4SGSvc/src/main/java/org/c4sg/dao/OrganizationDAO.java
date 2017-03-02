package org.c4sg.dao;

import java.util.List;

import org.c4sg.entity.Organization;
import org.springframework.data.repository.CrudRepository;

public interface OrganizationDAO extends CrudRepository<Organization, Integer> {
	
	Organization findByName(String name);
	List<Organization> findAll();
	Organization findOne(Integer id);
	/*@Query("SELECT o FROM Organization o WHERE LOWER(o.name) LIKE LOWER(CONCAT('%',:keyword,'%')) OR LOWER(o.description) LIKE LOWER(CONCAT('%',:keyword,'%'))")
	List<Organization> findByKeyword(String keyword);*/
	List<Organization> findByNameLikeOrDescriptionLikeAllIgnoreCase(String name, String description);
}
