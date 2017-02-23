package org.cs4g;

import java.util.ArrayList;

import org.c4sg.C4SgApplication;
import org.c4sg.dto.UserDto;
import org.c4sg.service.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

/**
 * This is a utility program used to populate dummy user records
 * meant for testing purposes only.
 *
 */
@SuppressWarnings("deprecation")
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes=C4SgApplication.class)
@WebAppConfiguration

public class PopulateUserTest {
	
	@Autowired
	UserService userService;
	
    @Test
	public void loadData() throws Exception {
		// TODO Auto-generated method stub
		// create an array of userDto	
		UserDto[] userDtos = createDtos();
				
		// while dto array has data, call userService to save
		for (UserDto userDto : userDtos) {
			userService.saveUser(userDto);
		}	
	}

	UserDto[] createDtos() {
		UserDto[] userDtos = null;
		ArrayList<UserDto> list =  new ArrayList<UserDto>();
		UserDto userDto =  null;
		for(int i = 100; i < 200; i++) {
			//create userDto
			userDto =  new UserDto();
			userDto.setId(i);
			userDto.setCountry("USA");
			userDto.setState("NY");
			userDto.setDisplayFlag("Y");
			userDto.setEmail("email_" + i + "@gmail.com");
			userDto.setFirstName("User" + i);
			userDto.setGithub(Integer.valueOf(i));
			userDto.setLastName("LName" + i);
			userDto.setLatitude("2.12345678");
			userDto.setLongitude("1.12345678");
			userDto.setPhone("212-911-1010");
			userDto.setRole("VOLUNTEER");
			userDto.setStatus("ACTIVE");
			userDto.setUserName("Uname" + i);
			userDto.setZip("28205");
			//add to list
			list.add(userDto);
			
		}
		userDtos = list.toArray(new UserDto[list.size()]);
		return userDtos;
	}
}
