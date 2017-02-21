package org.c4sg.controller;

import java.util.List;
import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    //Added on feb-2
    @CrossOrigin
    @RequestMapping(value = "/api/user/all/active", method = RequestMethod.GET)
    public List<UserDto> getActiveUsers() {
    	
    	System.out.println("**************All**************");
        return userService.findActiveUsers();
    }

    @CrossOrigin
    @RequestMapping(value = "/api/user/search/byId/{id}", method = RequestMethod.GET)
    public UserDto getUser(@PathVariable("id") int id) {
        return userService.findById(id);
    }

    @CrossOrigin
    @RequestMapping(value = "/api/developers", method = RequestMethod.GET)
    public List<User> getDevelopers() {
        return userService.findDevelopers();
    }

    @CrossOrigin
    @RequestMapping(value = "/api/user/{id}", method = RequestMethod.DELETE)
    public void deleteUser(@PathVariable("id") int id) {

    	System.out.println("************** Delete : id=" + id + "**************");
    	
        try {
            userService.deleteUser(id);
        } catch (Exception e) {
            System.out.println(e);
        }
    }
    @RequestMapping(value = "/api/user/all", method = RequestMethod.GET)
    public List<UserDto> getUsers() {
        return userService.findAll();
    }

    @CrossOrigin
    @RequestMapping(value = "/api/user", method = RequestMethod.POST)
    public UserDto createUser(@RequestBody UserDto userDto) {
        return userService.saveUser(userDto);
    }

    @CrossOrigin
    @RequestMapping(value = "/api/user", method = RequestMethod.PUT)
    public UserDto updateUser(@RequestBody UserDto userDto) {
        return userService.saveUser(userDto);
    }


}
