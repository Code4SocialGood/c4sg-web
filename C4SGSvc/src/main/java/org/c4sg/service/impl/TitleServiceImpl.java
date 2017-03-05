package org.c4sg.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.c4sg.dao.TitleDAO;
import org.c4sg.dto.TitleDTO;
import org.c4sg.entity.Title;
import org.c4sg.mapper.TitleMapper;
import org.c4sg.service.TitleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TitleServiceImpl implements TitleService {

	@Autowired
	private TitleDAO titleDAO;
	
	@Autowired
	private TitleMapper titleMapper;

    public List<TitleDTO> findTitles() {
    	List<Title> titles = titleDAO.findAllSorted();
    	List<TitleDTO> titleDTOS = titles.stream().map(o -> titleMapper.getTitleDtoFromEntity(o)).collect(Collectors.toList());
        return titleDTOS;
    }
}
