package org.c4sg.dao;

import org.c4sg.constant.Status;
import org.c4sg.constant.UserRole;
import org.c4sg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface UserDAO extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    String FIND_BY_ID_QUERY = "SELECT u FROM UserProject up " +
                                "JOIN up.user u " +
                                "JOIN up.project p " +
                                "WHERE p.id = :projId";

    //temporary until create date is added
    List<User> findByStatusOrderByUserNameAsc(Status status);

    User findById(int id);
    User findByEmail(String email);
    List<User> findByRoleAndDisplayFlagOrderByGithubDesc(UserRole role, Boolean display);

    @Query(FIND_BY_ID_QUERY)
    List<User> findByUserProjectId(@Param("projId") Integer projId);
}
