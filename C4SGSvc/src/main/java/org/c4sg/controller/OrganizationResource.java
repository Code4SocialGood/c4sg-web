package org.c4sg.controller;

import java.util.List;

import org.c4sg.entity.Organization;
import org.c4sg.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class OrganizationResource {

    @Autowired
    private OrganizationService organizationService;

    @CrossOrigin
    @RequestMapping(value = "/api/organization/all", produces = { "application/json" }, method = RequestMethod.GET)
    public List<Organization> getOrganizatios() {
        return organizationService.findOrganizations();
    }
    
    @CrossOrigin
    @RequestMapping(value = "/api/organization" + "/{id}", produces = { "application/json" }, method = RequestMethod.GET)
    public Organization getOrganization(@PathVariable("id") int id) {
        return organizationService.findOrganizations().get(id);
    }
}

