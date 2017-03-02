package org.c4sg.service;

import java.util.List;

import org.c4sg.dto.OrganizationDTO;

public interface OrganizationService {

    String UPLOAD_DIRECTORY = "logos";
    String LOGO_FORMAT = ".jpg";

	void save(OrganizationDTO organizationDTO);
    void deleteOrganization(int id);
    String getLogoUploadPath(String organizationName);
    OrganizationDTO findById(int id);
    OrganizationDTO createOrganization(OrganizationDTO organizationDTO);
    OrganizationDTO updateOrganization(int id, OrganizationDTO organizationDTO);
    List<OrganizationDTO> findOrganizations();
    List<OrganizationDTO> findByKeyword(String name);
}
