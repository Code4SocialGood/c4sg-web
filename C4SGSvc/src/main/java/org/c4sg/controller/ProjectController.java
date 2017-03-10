package org.c4sg.controller;

import io.swagger.annotations.*;
import org.c4sg.dto.ProjectDTO;
import org.c4sg.dto.UserDTO;
import org.c4sg.entity.Project;
import org.c4sg.exception.NotFoundException;
import org.c4sg.exception.UserProjectException;
import org.c4sg.service.ProjectService;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/projects")
@Api(description = "Operations about Projects", tags = "project")
public class ProjectController extends GenericController{

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @CrossOrigin
    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Find all projects", notes = "Returns a collection of projects")
    public List<ProjectDTO> getProjects() {
        return projectService.findProjects();
    }
    
    @CrossOrigin
    @RequestMapping(value = "/search/byId/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "Find project by ID", notes = "Returns a single project")
    public Project getProject(@ApiParam(value = "ID of project to return", required = true)
                                @PathVariable("id") int id) {
    	System.out.println("**************ID**************" + id);
        //return projectService.findProjects().get(id);
    	return projectService.findById(id);
    }
    
    @CrossOrigin
    @RequestMapping(value = "/search/byOrganization/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "Find projects by Organization ID", notes = "Returns a list of projects")
    public List<Project> getProjectsByOrganization(@ApiParam(value = "ID of an organization", required = true)
                                @PathVariable("id") int orgId) {
    	System.out.println("**************OrganizationID**************" + orgId);
    	return projectService.getProjectsByOrganization(orgId);
    }
    
    @CrossOrigin
    @RequestMapping(value = "/search/byName/{name}", method = RequestMethod.GET)
    @ApiOperation(value = "Find project by name", notes = "Returns a single project")
    public Project getProject(@ApiParam(value = "Name of project to return", required = true)
                                @PathVariable("name") String name) {
        return projectService.findByName(name);
    }
    
    @CrossOrigin
    @RequestMapping(value = "/search/byKeyword/{keyWord}", method = RequestMethod.GET)
    @ApiOperation(value = "Find project by keyWord", notes = "Returns a collection of projects")
    public List<Project> getProjects(@ApiParam(value = "Keyword of project to return", required = true)
                                        @PathVariable("keyWord") String keyWord) {
    	
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
    @RequestMapping(value = "/search/byUser/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "Find projects by user", notes = "Returns a collection of projects")
    @ApiResponses(value = {
            @ApiResponse(code = 404, message = "ID of user invalid")
            })
    public List<ProjectDTO> getProjectsByUser(@ApiParam(value = "userId of projects to return", required = true)
                                        @PathVariable("id") Integer id) {
    	
    	System.out.println("**************Search**************" + id);
    	
    	List<ProjectDTO> projects = null;
    	
        try {
        	projects = projectService.findByUser(id);
        } catch (Exception e) {
        	throw new NotFoundException("ID of user invalid");
        }

        return projects;
    }
    
    @CrossOrigin
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ApiOperation(value = "Add a new project")
    public Map<String, Object> createProject(@ApiParam(value = "Project object to return", required = true)
                                                @RequestBody @Valid Project project) {

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
    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @ApiOperation(value = "Deletes a project")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@ApiParam(value = "Project id to delete", required = true)
                                @PathVariable("id") int id) {

    	System.out.println("************** Delete : id=" + id + "**************");
    	
        try {
            projectService.deleteProject(id);
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    @ApiOperation(value = "Update an existing project")
    public Map<String, Object> updateProject(@ApiParam(value = "Updated project object", required = true)
                                                @RequestBody @Valid Project project) {

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

    @CrossOrigin
    @RequestMapping(value = "/{id}/users/{userId}", method = RequestMethod.POST)
    @ApiOperation(value = "Create a relation between user and project")
    @ApiResponses(value = {
            @ApiResponse(code = 404, message = "ID of project or user invalid")
    })
    //TODO: Replace explicit user{id} with AuthN user id.
    public ResponseEntity<?> createUserProject(@ApiParam(value = "ID of user", required = true)
                                                  @PathVariable("userId") Integer userId,
                                               @ApiParam(value = "ID of project", required = true)
                                                  @PathVariable("id") Integer projectId) {
        try {
            projectService.saveUserProject(userId, projectId);
            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                                                      .path("/{id}/users/{userId}")
                                                      .buildAndExpand(projectId, userId).toUri();
            return ResponseEntity.created(location).build();
        }catch (NullPointerException | UserProjectException e){
            throw new NotFoundException("ID of project or user invalid");
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Find applicants of a given project", notes = "Returns a collection of projects")
    @ApiResponses(value = {
            @ApiResponse(code = 404, message = "Applicants not found")
    })
    public ResponseEntity<List<UserDTO>> getApplicants(@ApiParam(value = "ID of project", required = true)
                                            @PathVariable("id") Integer projectId) {
        List<UserDTO> applicants = userService.getApplicants(projectId);

        if (!applicants.isEmpty()) {
           return ResponseEntity.ok().body(applicants);
        }else{
            throw new NotFoundException("Applicants not found");
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/applied/users/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "Find projects, with status applied, related to a given user",
                  notes = "Returns a collection of projects with status applied")
    public List<ProjectDTO> getProjects(@ApiParam(value = "ID of user", required = true)
                                            @PathVariable("id") Integer userId){
        return projectService.getAppliedProjects(userId);
    }
}

