package org.c4sg.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.c4sg.dao.SkillDAO;
import org.c4sg.dto.SkillDTO;
import org.c4sg.entity.Skill;
import org.c4sg.mapper.SkillMapper;
import org.c4sg.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SkillServiceImpl implements SkillService {

	@Autowired
	private SkillDAO skillDAO;
	
	@Autowired
	private SkillMapper skillMapper;

    public List<SkillDTO> findSkills() {
    	List<Skill> skills = skillDAO.findAllSorted();
    	List<SkillDTO> skillDTOS = skills.stream().map(o -> skillMapper.getSkillDtoFromEntity(o)).collect(Collectors.toList());
        return skillDTOS;
    }
}
