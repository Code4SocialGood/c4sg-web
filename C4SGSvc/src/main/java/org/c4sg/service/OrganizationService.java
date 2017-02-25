package org.c4sg.service;

import java.util.List;

import org.c4sg.dto.OrganizationDto;

public interface OrganizationService {

    String UPLOAD_DIRECTORY = "logos";
    String LOGO_FORMAT = ".jpg";

	public void save(OrganizationDto organizationDto);

    public List<OrganizationDto> findOrganizations();
    
    public OrganizationDto findById(int id);
    
    public List<OrganizationDto> findByKeyword(String name);
    
    public OrganizationDto createOrganization(OrganizationDto organizationDto);
    
    public OrganizationDto updateOrganization(int id, OrganizationDto organizationDto);
    
    public void deleteOrganization(int id);

    public String getLogoUploadPath(String organizationName);
    }
