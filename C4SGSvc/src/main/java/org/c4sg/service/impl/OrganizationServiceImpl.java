package org.c4sg.service.impl;

import java.util.List;

import org.c4sg.dao.OrganizationDao;
import org.c4sg.entity.Organization;
import org.c4sg.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrganizationServiceImpl implements OrganizationService {

	@Autowired
	private OrganizationDao organizationDao;
	
	public void save(Organization organization) {
		organizationDao.save(organization);
    }

    public List<Organization> findOrganizations() {
        return organizationDao.findAll();
    }
	

    public Organization findByName(String name) {
        return organizationDao.findByName(name);
    }
    
    public Organization createOrganization(Organization organization) {
    	Organization localOrganization = organizationDao.findByName(organization.getName());

        if (localOrganization != null) {
            //LOG.info("User with username {} already exist. Nothing will be done. ", user.getUsername());
        } else {
            localOrganization = organizationDao.save(organization);
        }

        return localOrganization;
    }

}
