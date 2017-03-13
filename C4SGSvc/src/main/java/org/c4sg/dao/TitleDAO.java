package org.c4sg.dao;

import java.util.List;

import org.c4sg.entity.Title;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface TitleDAO extends CrudRepository<Title, Integer> {
	
	List<Title> findAll();


	String FIND_ALL_SORTED_QUERY = "SELECT s FROM Title s " +
                              "ORDER BY s.title ASC";
    
    @Query(FIND_ALL_SORTED_QUERY)
    List<Title> findAllSorted();
}
