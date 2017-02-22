package org.c4sg.controller;

import org.apache.tomcat.util.codec.binary.Base64;
import org.c4sg.dto.OrganizationDto;
import org.c4sg.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
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

    static int counter = 0;

    @Autowired
    private OrganizationService organizationService;


    @RequestMapping(value = "/api/organization/{id}/uploadLogo", method = RequestMethod.POST)
    public
    @ResponseBody
    String uploadImage2(@PathVariable int organizationId, @RequestBody String requestBody, HttpServletRequest request) {
        try {
            //This will decode the String which is encoded by using Base64 class
            byte[] imageByte = Base64.decodeBase64(requestBody);
            File f = new File(organizationId + "-logo.jpg");
            //String directory= ServletContext.getRealPath("/")+"images/sample.jpg";
            new FileOutputStream(f).write(imageByte);
            return "success ";
        } catch (Exception e) {
            return "error = " + e;
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
}

