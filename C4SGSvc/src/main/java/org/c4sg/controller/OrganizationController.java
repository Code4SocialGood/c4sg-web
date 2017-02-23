package org.c4sg.controller;

import org.apache.tomcat.util.codec.binary.Base64;
import org.c4sg.dto.OrganizationDto;
import org.c4sg.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletContext;
import javax.validation.Valid;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
public class OrganizationController {

    private static final String UPLOAD_DIRECTORY = "logos";
    private static final String LOGO_FORMAT = ".jpg";

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
            File f = new File(getLogoUploadPath(organizationName));
            new FileOutputStream(f).write(imageByte);
            return "Success";
        } catch (Exception e) {
            return "Error saving logo for organization " + organizationName + " : " + e;
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/api/organization/all", produces = {"application/json"}, method = RequestMethod.GET)
    public List<OrganizationDto> getOrganizations() {
        return organizationService.findOrganizations();
    }

    @CrossOrigin
    @RequestMapping(value = "/api/organization/search/byId/{id}", produces = {"application/json"}, method = RequestMethod.GET)
    public OrganizationDto getOrganization(@PathVariable("id") int id) {
        return organizationService.findOrganizations().get(id);
    }

    @CrossOrigin
    @RequestMapping(value = "/api/organization/search/byKeyword/{keyWord}", produces = {"application/json"}, method = RequestMethod.GET)
    public List<OrganizationDto> getOrganization(@PathVariable("keyWord") String keyWord) {
        return organizationService.findByKeyword(keyWord);
    }

    @CrossOrigin
    @RequestMapping(value = "/api/organization/create", method = RequestMethod.POST)
    public Map<String, Object> createOrganization(@RequestBody @Valid OrganizationDto organizationDto) {
        System.out.println("**************Create**************");
        Map<String, Object> responseData = null;
        organizationDto.setLogo(getLogoUploadPath(organizationDto.getName()));
        try {
            OrganizationDto createdOrganization = organizationService.createOrganization(organizationDto);
            responseData = Collections.synchronizedMap(new HashMap<>());
            responseData.put("organization", createdOrganization);
        } catch (Exception e) {
            System.err.println(e);
        }
        return responseData;
    }

    @CrossOrigin
    @RequestMapping(value = "/api/organization/update/{id}", method = RequestMethod.PUT)
    public Map<String, Object> updateOrganization(@PathVariable("id") int id, @RequestBody @Valid OrganizationDto organizationDto) {
        System.out.println("**************Update : id=" + organizationDto.getId() + "**************");
        Map<String, Object> responseData = null;
        try {
            OrganizationDto updatedOrganization = organizationService.updateOrganization(id, organizationDto);
            responseData = Collections.synchronizedMap(new HashMap<>());
            responseData.put("organization", updatedOrganization);
        } catch (Exception e) {
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

    private String getLogoUploadPath(String organizationName) {
        return UPLOAD_DIRECTORY + File.separator + organizationName + LOGO_FORMAT;
    }

}

