package org.c4sg.mapper;

import org.c4sg.dto.ProjectDto;
import org.c4sg.entity.Project;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper extends ModelMapper{

	public ProjectDto getProjectDtoFromEntity(Project project){
		ProjectDto projectDto = map(project, ProjectDto.class);
		
		//Explicit mapping for organization name
		TypeMap<Project, ProjectDto> typeMap = getTypeMap(Project.class, ProjectDto.class);
		if(typeMap == null){
			addMappings(new PropertyMap<Project, ProjectDto>() {
				@Override
				protected void configure() {
					map().setOrganizationName(source.getOrganization().getName());
				}
			});
		}
		return projectDto;
	}
	
	public Project getProjectEntityFromDto(ProjectDto projectDto){
		Project project = map(projectDto, Project.class);
		return project;
	}
}
