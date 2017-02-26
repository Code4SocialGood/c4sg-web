package org.c4sg.dao;

import java.util.List;

import org.c4sg.entity.Organization;
import org.springframework.data.repository.CrudRepository;

public interface OrganizationDAO extends CrudRepository<Organization, Long> {
	
	Organization findByName(String name);
	List<Organization> findAll();
	Organization findById(int id);
	/*@Query("SELECT o FROM Organization o WHERE LOWER(o.name) LIKE LOWER(CONCAT('%',:keyword,'%')) OR LOWER(o.briefDescription) LIKE LOWER(CONCAT('%',:keyword,'%'))  OR LOWER(o.detailedDescription) LIKE LOWER(CONCAT('%',:keyword,'%'))")
	List<Organization> findByKeyword(String keyword);*/
	List<Organization> findByNameLikeOrBriefDescriptionLikeOrDetailedDescriptionLikeAllIgnoreCase(String name, String briefDescription, String detailedDescription);
}
