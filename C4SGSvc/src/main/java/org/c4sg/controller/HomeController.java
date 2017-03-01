package org.c4sg.controller;

import io.swagger.annotations.Api;
import org.c4sg.dto.OrganizationDTO;
import org.c4sg.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(description = "Operations about Home", tags = "home")
public class HomeController {
	
	@Autowired
	private OrganizationService organizationService;
	
	@RequestMapping("/home")
	public String home() {
		
        OrganizationDTO organizationDTO = organizationService.findById(1);

        return organizationDTO.getName() + " ; " + organizationDTO.getId();
	}
	
/*	@RequestMapping("/home")
	public String home(Model model) {
		
        Organization organization = organizationService.findByName("test");
        model.addAttribute("organization", organization);

        return "home";
        // return "C4SG Home";
	}*/
}
