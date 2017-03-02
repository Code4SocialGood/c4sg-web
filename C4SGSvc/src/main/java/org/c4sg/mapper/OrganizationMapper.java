package org.c4sg.mapper;

import org.c4sg.dto.OrganizationDTO;
import org.c4sg.entity.Organization;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class OrganizationMapper extends ModelMapper {

	public OrganizationDTO getOrganizationDtoFromEntity(Organization organization){
		OrganizationDTO organizationDTO = map(organization, OrganizationDTO.class);
		return organizationDTO;
	}
	
	public Organization getOrganizationEntityFromDto(OrganizationDTO organizationDTO){
		Organization organization = map(organizationDTO, Organization.class);
		return organization;
	}
}
