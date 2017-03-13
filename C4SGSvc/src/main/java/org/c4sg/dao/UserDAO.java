package org.c4sg.dao;


import java.util.List;

import org.c4sg.constant.Status;
import org.c4sg.constant.UserRole;
import org.c4sg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserDAO extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    String FIND_BY_ID_QUERY = "SELECT u FROM UserProject up " +
                                "JOIN up.user u " +
                                "JOIN up.project p " +
                                "WHERE p.id = :projId";

    List<User> findAll();
    //temporary until create date is added
    List<User> findByStatusOrderByUserNameAsc(Status status);
    User findById(int id);
    User findByUserName(String name);
    User findByEmail(String email);
    List<User> findByRoleAndDisplayFlagOrderByGithubDesc(UserRole role, Boolean display);

    @Query(FIND_BY_ID_QUERY)
    List<User> findByUserProjectId(@Param("projId") Integer projId);
}
