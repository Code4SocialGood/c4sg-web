package org.c4sg.mapper;

import org.c4sg.dto.TitleDTO;
import org.c4sg.entity.Title;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class TitleMapper extends ModelMapper {

	public TitleDTO getTitleDtoFromEntity(Title title){
		TitleDTO titleDTO = map(title, TitleDTO.class);
		return titleDTO;
	}
	
	public Title getTitleEntityFromDto(TitleDTO titleDTO){
		Title title = map(titleDTO, Title.class);
		return title;
	}
}
