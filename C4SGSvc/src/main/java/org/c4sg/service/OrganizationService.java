package org.c4sg.service;

import java.util.List;

import org.c4sg.entity.Organization;

public interface OrganizationService {

	public void save(Organization organization);

    public List<Organization> findOrganizations();
    
    public Organization findByName(String name);
    
    public Organization createOrganization(Organization organization);
}
