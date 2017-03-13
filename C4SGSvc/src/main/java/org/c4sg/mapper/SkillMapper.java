package org.c4sg.mapper;

import org.c4sg.dto.SkillDTO;
import org.c4sg.entity.Skill;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class SkillMapper extends ModelMapper {

	public SkillDTO getSkillDtoFromEntity(Skill skill){
		SkillDTO skillDTO = map(skill, SkillDTO.class);
		return skillDTO;
	}
	
	public Skill getSkillEntityFromDto(SkillDTO skillDTO){
		Skill skill = map(skillDTO, Skill.class);
		return skill;
	}
}
