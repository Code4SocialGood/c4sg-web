package org.c4sg.controller;

import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    //Added on feb-2
    @CrossOrigin
    @RequestMapping(value = "/api/user/all", method = RequestMethod.GET)
    public List<UserDto> getUsers() {
    	
    	System.out.println("**************All**************");
        return userService.findAll();
    }

    @CrossOrigin
    @RequestMapping(value = "/api/user/search/byId/{id}", method = RequestMethod.GET)
    public User getUser(@PathVariable("id") int id) {
        return userService.findById(id);
    }

    @CrossOrigin
    @RequestMapping(value = "/api/developers", method = RequestMethod.GET)
    public List<User> getDevelopers() {
        return userService.findDevelopers();
    }

    @CrossOrigin
    @RequestMapping(value = "/api/user/delete/{id}", method = RequestMethod.DELETE)
    public void deleteUser(@PathVariable("id") int id) {

    	System.out.println("************** Delete : id=" + id + "**************");
    	
        try {
            userService.deleteUser(id);
        } catch (Exception e) {
            System.out.println(e);
        }
    }

}
