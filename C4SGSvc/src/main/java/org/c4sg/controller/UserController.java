package org.c4sg.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import org.c4sg.dao.UserDao;
import org.c4sg.dto.UserDto;
import org.c4sg.service.UserService;
import org.c4sg.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.c4sg.entity.User;
import org.c4sg.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class UserController {

	@Autowired
	 UserService  userService;
	 @Autowired 
	 UserDao userDao;
	 @Autowired
	 UserValidator userValidator;

	 @InitBinder
	    public void initBinder(WebDataBinder binder) {
	        binder.addValidators(userValidator);
	    }

	 
	@CrossOrigin
	    @RequestMapping(value="/api/user/signup", method = RequestMethod.POST)
	    public  Map<String, Object> createUser(@RequestBody @Valid UserDto userDto){
		System.out.println("**************Create**************");
    	Map<String, Object> responseData = null;
    	try{
    		UserDto createdUser = userService.createUser(userDto);
    		responseData = Collections.synchronizedMap(new HashMap<>());
    		responseData.put("User", createdUser);
    	}catch(Exception e){
    		System.err.println(e);
    	}
    	return responseData;
    	}
	
		@RequestMapping(value = "/api/user/signin", method = RequestMethod.POST)
		 public  Map<String, Object> signInUser(@RequestBody @Valid UserDto userDto){
			System.out.println("**************Login**************");
	    	Map<String, Object> responseData = null;
	    	try{
	    		UserDto currentUser = userService.currentUser(userDto);
	    		responseData = Collections.synchronizedMap(new HashMap<>());
	    		responseData.put("User", currentUser);
	    	}catch(Exception e){
	    		System.err.println(e);
	    	}
	    	return responseData;
	    	}
		
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
 
  /*  @RequestMapping(value="/api/user/signout", method = RequestMethod.GET)
    public  Map<String, Object> signOutUser(@RequestBody @Valid UserDto userDto){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> responseData = null;
        if (auth != null){    
            new SecurityContextLogoutHandler().logout(userDto, responseData, auth);
        }
        return responseData;
    }*/
 
	
	/* To find Json format
	 * 
	 * @RequestMapping(value = "/api/user/userformat", method = RequestMethod.GET)
	public @ResponseBody UserDto getUserFormat() {
	    UserDto user = new UserDto();
	    user.setId("1");
	    user.setUserName("Prabha");
	    user.setPassword("XXX");
	    user.setRpassword("XXX");
	    return user;
	}*/

}