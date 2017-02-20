package org.c4sg.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.c4sg.constant.Status;
import org.c4sg.dao.OrganizationDAO;
import org.c4sg.dto.OrganizationDTO;
import org.c4sg.entity.Organization;
import org.c4sg.mapper.OrganizationMapper;
import org.c4sg.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrganizationServiceImpl implements OrganizationService {

	@Autowired
	private OrganizationDAO organizationDAO;
	
	@Autowired
	private OrganizationMapper organizationMapper;
	
	public void save(OrganizationDTO organizationDTO) {
		Organization organization = organizationMapper.getOrganizationEntityFromDto(organizationDTO);
		organizationDAO.save(organization);
    }

    public List<OrganizationDTO> findOrganizations() {
    	List<Organization> organizations = organizationDAO.findAll();
    	List<OrganizationDTO> organizationDTOS = organizations.stream().map(o -> organizationMapper.getOrganizationDtoFromEntity(o)).collect(Collectors.toList());
        return organizationDTOS;
    }
	
    public OrganizationDTO findById(int id) {
        return organizationMapper.getOrganizationDtoFromEntity(organizationDAO.findById(id));
    }

    public List<OrganizationDTO> findByKeyword(String keyWord) {
    	List<Organization> organizations = organizationDAO.findByNameLikeOrBriefDescriptionLikeOrDetailedDescriptionLikeAllIgnoreCase(keyWord, keyWord, keyWord);
    	if(organizations == null || organizations.isEmpty()){
    		return null;
    	}
    	List<OrganizationDTO> organizationDTOS = organizations.stream()
    			.map(o -> organizationMapper.getOrganizationDtoFromEntity(o)).collect(Collectors.toList());
    	return organizationDTOS;
    }
    
    public OrganizationDTO createOrganization(OrganizationDTO organizationDTO) {
    	Organization organization = organizationDAO.findByName(organizationDTO.getName());

        if (organization != null) {
        	//TODO: return error message
        } else {
            organization = organizationDAO.save(organizationMapper.getOrganizationEntityFromDto(organizationDTO));
        }

        return organizationMapper.getOrganizationDtoFromEntity(organization);
    }
    
    public OrganizationDTO updateOrganization(int id, OrganizationDTO organizationDTO) {
    	Organization organization = organizationDAO.findById(id);
        if (organization == null) {
        	//TODO: create new?
        } else {
            organization = organizationDAO.save(organizationMapper.getOrganizationEntityFromDto(organizationDTO));
        }

        return organizationMapper.getOrganizationDtoFromEntity(organization);
    }
    
    public void deleteOrganization(int id){
    	Organization organization = organizationDAO.findById(id);
    	if(organization != null){
    		organization.setStatus(Status.DELETED);
    		//TODO: Local or Timezone?
    		//TODO: Format date
    		//organization.setDeleteTime(LocalDateTime.now().toString());
    		//organization.setDeleteBy(user.getUsername());
    		organizationDAO.save(organization);
    	}
    }

}
