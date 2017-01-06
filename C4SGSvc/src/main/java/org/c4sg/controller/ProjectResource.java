package org.c4sg.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.c4sg.dto.ProjectDto;
import org.c4sg.entity.Project;
import org.c4sg.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class ProjectResource {

    @Autowired
    private ProjectService projectService;

    @CrossOrigin
    @RequestMapping(value = "/api/project/all", method = RequestMethod.GET)
    public List<ProjectDto> getProjects() {
    	
    	System.out.println("**************All**************");
        return projectService.findProjects();
    }
    
    @CrossOrigin
    @RequestMapping(value = "/api/project/search/byId/{id}", method = RequestMethod.GET)
    public Project getProject(@PathVariable("id") int id) {
    	
    	System.out.println("**************ID**************" + id);
        //return projectService.findProjects().get(id);
    	return projectService.findById(id);
    }
    
    @CrossOrigin
    @RequestMapping(value = "/api/project/search/byName/{name}", method = RequestMethod.GET)
    public Project getProject(@PathVariable("name") String name) {
    	
        return projectService.findByName(name);
    }
    
    @CrossOrigin
    @RequestMapping(value = "/api/project/search/byKeyword/{keyWord}", method = RequestMethod.GET)
    public List<Project> getProjects(@PathVariable("keyWord") String keyWord) {
    	
    	System.out.println("**************Search**************" + keyWord);
    	
    	List<Project> projects = null;
    	
        try {
        	projects = projectService.findByKeyword(keyWord);
        	if (projects != null)
        		System.out.println("***" + projects.size());
        	else 
        		System.out.println("***empty");
        } catch (Exception e) {
            System.out.println(e);
        }

        return projects;
    }
    
    @CrossOrigin
    @RequestMapping(value = "/api/project/add", method = RequestMethod.POST)
    public Map<String, Object> createProject(@RequestBody @Valid Project project) {

    	System.out.println("**************Add**************");
    	
    	Map<String, Object> responseData = null;
    	
        try {
            Project createProject = projectService.createProject(project);
            responseData = Collections.synchronizedMap(new HashMap<>());
            responseData.put("project", createProject);
        } catch (Exception e) {
            System.out.println(e);
        }

        return responseData;
    }
    
    @CrossOrigin
    @RequestMapping(value = "/api/project/delete/{id}", method = RequestMethod.DELETE)
    public void deleteProject(@PathVariable("id") int id) {

    	System.out.println("************** Delete : id=" + id + "**************");
    	
        try {
            projectService.deleteProject(id);
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/api/project/update", method = RequestMethod.PUT)
    public Map<String, Object> updateProject(@RequestBody @Valid Project project) {

    	System.out.println("**************Update : id=" + project.getId() + "**************");
    	
    	Map<String, Object> responseData = null;
    	
        try {
            Project updateProject = projectService.updateProject(project);
            responseData = Collections.synchronizedMap(new HashMap<>());
            responseData.put("project", updateProject);
        } catch (Exception e) {
            System.out.println(e);
        }

        return responseData;
    }
}

