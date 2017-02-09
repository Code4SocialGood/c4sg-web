package org.c4sg.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.c4sg.constant.Status;
import org.c4sg.dao.OrganizationDao;
import org.c4sg.dto.OrganizationDto;
import org.c4sg.entity.Organization;
import org.c4sg.mapper.OrganizationMapper;
import org.c4sg.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrganizationServiceImpl implements OrganizationService {

	@Autowired
	private OrganizationDao organizationDao;
	
	@Autowired
	private OrganizationMapper organizationMapper;
	
	public void save(OrganizationDto organizationDto) {
		Organization organization = organizationMapper.getOrganizationEntityFromDto(organizationDto);
		organizationDao.save(organization);
    }

    public List<OrganizationDto> findOrganizations() {
    	List<Organization> organizations = organizationDao.findAll();
    	List<OrganizationDto> organizationDtos = organizations.stream().map(o -> organizationMapper.getOrganizationDtoFromEntity(o)).collect(Collectors.toList());
        return organizationDtos;
    }
	
    public OrganizationDto findById(int id) {
        return organizationMapper.getOrganizationDtoFromEntity(organizationDao.findById(id));
    }

    public List<OrganizationDto> findByKeyword(String keyWord) {
    	List<Organization> organizations = organizationDao.findByNameLikeOrBriefDescriptionLikeOrDetailedDescriptionLikeAllIgnoreCase(keyWord, keyWord, keyWord);
    	if(organizations == null || organizations.isEmpty()){
    		return null;
    	}
    	List<OrganizationDto> organizationDtos = organizations.stream()
    			.map(o -> organizationMapper.getOrganizationDtoFromEntity(o)).collect(Collectors.toList());
    	return organizationDtos;
    }
    
    public OrganizationDto createOrganization(OrganizationDto organizationDto) {
    	Organization organization = organizationDao.findByName(organizationDto.getName());

        if (organization != null) {
        	//TODO: return error message
        } else {
            organization = organizationDao.save(organizationMapper.getOrganizationEntityFromDto(organizationDto));
        }

        return organizationMapper.getOrganizationDtoFromEntity(organization);
    }
    
    public OrganizationDto updateOrganization(int id, OrganizationDto organizationDto) {
    	Organization organization = organizationDao.findById(id);
        if (organization == null) {
        	//TODO: create new?
        } else {
            organization = organizationDao.save(organizationMapper.getOrganizationEntityFromDto(organizationDto));
        }

        return organizationMapper.getOrganizationDtoFromEntity(organization);
    }
    
    public void deleteOrganization(int id){
    	Organization organization = organizationDao.findById(id);
    	if(organization != null){
    		organization.setStatus(Status.DELETED);
    		//TODO: Local or Timezone?
    		//TODO: Format date
    		//organization.setDeleteTime(LocalDateTime.now().toString());
    		//organization.setDeleteBy(user.getUsername());
    		organizationDao.save(organization);
    	}
    }

}
