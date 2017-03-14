package org.c4sg.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

import org.apache.tomcat.util.codec.binary.Base64;
import org.c4sg.constant.Directory;
import org.c4sg.dto.UserDTO;
import org.c4sg.entity.User;
import org.c4sg.service.UserService;
import org.c4sg.util.FileUploadUtil;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import static org.c4sg.constant.Directory.AVATAR_UPLOAD;
import static org.c4sg.constant.Directory.RESUME_UPLOAD;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/users")
@Api(description = "Operations about Users", tags = "user")
public class UserController {
    private static Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @CrossOrigin
    @RequestMapping(value = "/active", method = RequestMethod.GET)
    @ApiOperation(value = "Find users, with status applied", notes = "Returns a collection of active users")
    public List<UserDTO> getActiveUsers() {
        LOGGER.debug("**************All**************");
        return userService.findActiveUsers();
    }

    @RequestMapping(method = RequestMethod.GET)
    @ApiOperation(value = "Find all users", notes = "Returns a collection of users")
    public List<UserDTO> getUsers() {
        return userService.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ApiOperation(value = "Find user by ID", notes = "Returns a user")
    public UserDTO getUser(@ApiParam(value = "ID of user to return", required = true)
                           @PathVariable("id") int id) {
        return userService.findById(id);
    }
    
    @CrossOrigin
    @RequestMapping(value = "/email/{email}/", method = RequestMethod.GET)
    @ApiOperation(value = "Find user by email", notes = "Returns a user")
    public UserDTO getUserByEmail(@ApiParam(value = "email address", required = true)
                               @PathVariable("email") String email) {
        return userService.findByEmail(email);
    }
    
    @RequestMapping(method = RequestMethod.POST)
    @ApiOperation(value = "Add a new user")
    public UserDTO createUser(@ApiParam(value = "User object to return", required = true)
                              @RequestBody UserDTO userDTO) {
        return userService.saveUser(userDTO);
    }

    @RequestMapping(method = RequestMethod.PUT)
    @ApiOperation(value = "Update an existing user")
    public UserDTO updateUser(@ApiParam(value = "Updated user object", required = true)
                              @RequestBody UserDTO userDTO) {
        return userService.saveUser(userDTO);
    }

    @RequestMapping(value = "/developers", method = RequestMethod.GET)
    @ApiOperation(value = "Find developers", notes = "Returns a collection of users")
    public List<User> getDevelopers() {
        return userService.findDevelopers();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ApiOperation(value = "Delete a user")
    public void deleteUser(@ApiParam(value = "User id to delete", required = true)
                           @PathVariable("id") int id) {
       LOGGER.debug("************** Delete : id=" + id + "**************");
        try {
            userService.deleteUser(id);
        } catch (Exception e) {
           LOGGER.error("Exception on delete user:", e);
        }
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET)
    public List<UserDTO> search(@RequestParam(required = false) String userName,
                                @RequestParam(required = false) String firstName,
                                @RequestParam(required = false) String lastName) {
        return userService.search(userName, firstName, lastName);
    }
    
    @RequestMapping(value = "/{id}/uploadAvatar", method = RequestMethod.POST)
	@ApiOperation(value = "Add new upload Avatar")
	public String uploadAvatar(@ApiParam(value = "user Id", required = true) @PathVariable("id") Integer id,
			@ApiParam(value = "Image File", required = true) @RequestPart("file") MultipartFile file) {

		String contentType = file.getContentType();
		if (!FileUploadUtil.isValidImageFile(contentType)) {
			return "Invalid image File! Content Type :-" + contentType;
		}
		File directory = new File(AVATAR_UPLOAD.getValue());
		if (!directory.exists()) {
			directory.mkdir();
		}
		File f = new File(userService.getAvatarUploadPath(id));
		try (FileOutputStream fos = new FileOutputStream(f)) {
			byte[] imageByte = file.getBytes();
			fos.write(imageByte);
			return "Success";
		} catch (Exception e) {
			return "Error saving avatar for User " + id + " : " + e;
		}
	}

	// Determining if this approach is better that using base64
	@RequestMapping(value = "/{id}/uploadResume", method = RequestMethod.POST)
	@ApiOperation(value = "Add new upload resume")
	public String uploadResume(@ApiParam(value = "user Id", required = true) @PathVariable("id") Integer id,
			@ApiParam(value = "Resume File(.pdf)", required = true) @RequestPart("file") MultipartFile file) {

		String contentType = file.getContentType();
		if (!FileUploadUtil.isValidResumeFile(contentType)) {
			return "Invalid pdf File! Content Type :-" + contentType;
		}
		File directory = new File(RESUME_UPLOAD.getValue());
		if (!directory.exists()) {
			directory.mkdir();
		}
		File f = new File(userService.getResumeUploadPath(id));
		try (FileOutputStream fos = new FileOutputStream(f)) {
			byte[] fileByte = file.getBytes();
			fos.write(fileByte);
			return "Success";
		} catch (Exception e) {
			return "Error saving resume for User " + id + " : " + e;
		}
	}
}