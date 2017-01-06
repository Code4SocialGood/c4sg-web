package org.c4sg.mapper;

import org.c4sg.dto.OrganizationDto;
import org.c4sg.entity.Organization;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class OrganizationMapper extends ModelMapper {

	public OrganizationDto getOrganzationDtoFromEntity(Organization organization){
		OrganizationDto organizationDto = map(organization, OrganizationDto.class);
		return organizationDto;
	}
	
	public Organization getOrganizationEntityFromDto(OrganizationDto organizationDto){
		Organization organization = map(organizationDto, Organization.class);
		return organization;
	}
}
