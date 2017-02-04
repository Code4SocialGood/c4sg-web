package org.c4sg.controller;

import org.c4sg.entity.User;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;


    @CrossOrigin
    @RequestMapping(value = "/api/users/{id}", method = RequestMethod.GET)
    public User getUser(@PathVariable("id") int id) {
        return userService.findById(id);
    }

    @CrossOrigin
    @RequestMapping(value = "/api/developers", method = RequestMethod.GET)
    public List<User> getDevelopers() {
        return userService.findDevelopers();
    }
}
