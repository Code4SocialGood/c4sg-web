package org.c4sg.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.apache.tomcat.util.codec.binary.Base64;
import org.c4sg.dto.OrganizationDTO;
import org.c4sg.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import static org.c4sg.service.OrganizationService.UPLOAD_DIRECTORY;

@CrossOrigin
@RestController
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @RequestMapping(value = "/api/organization/{organizationName}/uploadLogo", method = RequestMethod.POST)
    public String uploadLogo(@PathVariable String organizationName, @RequestBody String requestBody) {
        try {
            byte[] imageByte = Base64.decodeBase64(requestBody);
            File directory = new File(UPLOAD_DIRECTORY);
            if (!directory.exists()) {
                directory.mkdir();
            }
            File f = new File(organizationService.getLogoUploadPath(organizationName));
            new FileOutputStream(f).write(imageByte);
            return "Success";
        } catch (Exception e) {
            return "Error saving logo for organization " + organizationName + " : " + e;
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/api/organization/all", produces = { "application/json" }, method = RequestMethod.GET)
    public List<OrganizationDTO> getOrganizations() {
        return organizationService.findOrganizations();
    }
    
    @CrossOrigin
    @RequestMapping(value = "/api/organization/search/byId/{id}", produces = { "application/json" }, method = RequestMethod.GET)
    public OrganizationDTO getOrganization(@PathVariable("id") int id) {
        return organizationService.findById(id);
    }
    
    @CrossOrigin
    @RequestMapping(value = "/api/organization/search/byKeyword/{keyWord}", produces = { "application/json" }, method = RequestMethod.GET)
    public List<OrganizationDTO> getOrganization(@PathVariable("keyWord") String keyWord) {
        return organizationService.findByKeyword(keyWord);
    }
    
    @CrossOrigin
    @RequestMapping(value="/api/organization/create", method = RequestMethod.POST)
    public Map<String, Object> createOrganization(@RequestBody @Valid OrganizationDTO organizationDTO){
    	System.out.println("**************Create**************");
    	Map<String, Object> responseData = null;
        organizationDTO.setLogo(organizationService.getLogoUploadPath(organizationDTO.getName()));
        try{
    		OrganizationDTO createdOrganization = organizationService.createOrganization(organizationDTO);
    		responseData = Collections.synchronizedMap(new HashMap<>());
    		responseData.put("organization", createdOrganization);
    	}catch(Exception e){
    		System.err.println(e);
    	}
    	return responseData;
    }
    
    @CrossOrigin
    @RequestMapping(value="/api/organization/update/{id}", method = RequestMethod.PUT)
    public Map<String, Object> updateOrganization(@PathVariable("id") int id, @RequestBody @Valid OrganizationDTO organizationDTO){
    	System.out.println("**************Update : id=" + organizationDTO.getId() + "**************");
    	Map<String, Object> responseData = null;
    	try{
    		OrganizationDTO updatedOrganization = organizationService.updateOrganization(id, organizationDTO);
    		responseData = Collections.synchronizedMap(new HashMap<>());
    		responseData.put("organization", updatedOrganization);
    	}catch(Exception e){
    		System.err.println(e);
    	}
    	return responseData;
    }

    @CrossOrigin
    @RequestMapping(value = "/api/organization/delete/{id}", method = RequestMethod.DELETE)
    public void deleteOrganization(@PathVariable("id") int id) {
        System.out.println("************** Delete : id=" + id + "**************");

        try {
            organizationService.deleteOrganization(id);
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}

