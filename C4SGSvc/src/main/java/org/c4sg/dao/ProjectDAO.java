package org.c4sg.dao;

import java.util.List;

import org.c4sg.entity.Project;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ProjectDAO extends CrudRepository<Project, Long> {

    String FIND_BY_ID_QUERY = "SELECT u FROM UserProject up " +
                                "JOIN User u " +
                                "JOIN up.project p " +
                                    "WHERE p.id = :projId";

    String FIND_BY_USER_STATUS_QUERY = "SELECT p FROM UserProject up " +
                                            "JOIN up.project p " +
                                                "WHERE up.user.id = :userId AND up.status = :status ";
    
    String FIND_BY_ORGANIZATION_ID = "SELECT p FROM Project p WHERE p.organization.id=:orgId";

	Project findById(int id);
	Project findByName(String name);
	List<Project> findAll();
	
	@Query(FIND_BY_ORGANIZATION_ID)
	List<Project> getProjectsByOrganization(@Param("orgId") Integer orgId);
	
	@Query(FIND_BY_USER_STATUS_QUERY)
	List<Project> findByStatus(@Param("userId") Integer userId, @Param("status") String status);
	
}
