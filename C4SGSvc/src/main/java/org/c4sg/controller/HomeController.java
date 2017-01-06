package org.c4sg.controller;

import org.c4sg.entity.Organization;
import org.c4sg.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	
	@Autowired
	private OrganizationService organizationService;
	
	@RequestMapping("/home")
	public String home() {
		
        Organization organization = organizationService.findByName("test");

        return organization.getName() + " ; " + organization.getId();
	}
	
/*	@RequestMapping("/home")
	public String home(Model model) {
		
        Organization organization = organizationService.findByName("test");
        model.addAttribute("organization", organization);

        return "home";
        // return "C4SG Home";
	}*/
}
