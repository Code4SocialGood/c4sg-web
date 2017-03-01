package org.c4sg.controller;

import java.util.List;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.c4sg.dto.UserDTO;
import org.c4sg.entity.User;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@Api(description = "Operations about Users", tags = "user")
public class UserController {

    @Autowired
    private UserService userService;

    @CrossOrigin
    @RequestMapping(value = "/api/user/all/active", method = RequestMethod.GET)
    @ApiOperation(value = "Find users, with status applied", notes = "Returns a collection of active users")
    public List<UserDTO> getActiveUsers() {
    	
    	System.out.println("**************All**************");
        return userService.findActiveUsers();
    }

    @CrossOrigin
    @RequestMapping(value = "/api/user/search/byId/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "Find user by ID", notes = "Returns a user")
    public UserDTO getUser(@ApiParam(value = "ID of project to return", required = true)
                               @PathVariable("id") int id) {
        return userService.findById(id);
    }

    @CrossOrigin
    @RequestMapping(value = "/api/developers", method = RequestMethod.GET)
    @ApiOperation(value = "Find developers", notes = "Returns a collection of users")
    public List<User> getDevelopers() {
        return userService.findDevelopers();
    }

    @CrossOrigin
    @RequestMapping(value = "/api/user/{id}", method = RequestMethod.DELETE)
    @ApiOperation(value = "Delete an user")
    public void deleteUser(@ApiParam(value = "User id to delete", required = true)
                               @PathVariable("id") int id) {
    	System.out.println("************** Delete : id=" + id + "**************");
    	
        try {
            userService.deleteUser(id);
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    @RequestMapping(value = "/api/user/all", method = RequestMethod.GET)
    @ApiOperation(value = "Find all users", notes = "Returns a collection of users")
    public List<UserDTO> getUsers() {
        return userService.findAll();
    }

    @CrossOrigin
    @RequestMapping(value = "/api/user", method = RequestMethod.POST)
    @ApiOperation(value = "Add a new user")
    public UserDTO createUser(@ApiParam(value = "User object to return", required = true)
                                  @RequestBody UserDTO userDTO) {
        return userService.saveUser(userDTO);
    }

    @CrossOrigin
    @RequestMapping(value = "/api/user", method = RequestMethod.PUT)
    @ApiOperation(value = "Update an existing user")
    public UserDTO updateUser(@ApiParam(value = "Updated user object", required = true)
                                  @RequestBody UserDTO userDTO) {
        return userService.saveUser(userDTO);
    }
}
