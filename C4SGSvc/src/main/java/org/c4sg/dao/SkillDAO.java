package org.c4sg.dao;

import java.util.List;

import org.c4sg.entity.Skill;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface SkillDAO extends CrudRepository<Skill, Integer> {
	
	List<Skill> findAll();


	String FIND_ALL_SORTED_QUERY = "SELECT s FROM Skill s " +
                              "ORDER BY s.skill ASC";
    
    @Query(FIND_ALL_SORTED_QUERY)
    List<Skill> findAllSorted();
}
