package org.cs4g;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.c4sg.C4SgApplication;
import org.c4sg.controller.UserController;
import org.c4sg.dao.UserDAO;
import org.c4sg.dto.UserDTO;
import org.c4sg.service.UserService;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;



@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {C4SgApplication.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserControllerTest {	

	private MockMvc mockMvc;
	
	@Mock
	private UserService userServiceMock;
	//private UserDAO userDao;
	
	@InjectMocks
	private UserController userController;
	
	@Before
	 public void setup() {
	      this.mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
	 }

	 //Testing GET
	 @Test
	 public void testGetUsers() throws Exception
	 {
		//Mock user data 
		 List<UserDTO> mockUsers = getMockUsers("All");
		 
		 when(userServiceMock.findAll()).thenReturn(mockUsers);
		 
		 this.mockMvc.perform(get("/api/users")
				 .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))	
		 .andExpect(status().isOk())
		 .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
		 .andExpect(jsonPath("$", hasSize(4)))
		 .andExpect(jsonPath("$[0].id",is(1)))
		 .andExpect(jsonPath("$[0].github",is(1)))
		 .andExpect(jsonPath("$[0].userName",is("test1UserName")))
		 .andExpect(jsonPath("$[0].firstName",is("test1FirstName")))
		 .andExpect(jsonPath("$[0].lastName",is("test1LastName")))
		 .andExpect(jsonPath("$[0].email",is("test1Email@gmail.com")))
		 .andExpect(jsonPath("$[0].phone",is("9542234567")))		 
		 .andExpect(jsonPath("$[0].status",is("A")))
		 .andExpect(jsonPath("$[0].role",is("V")))
		 .andExpect(jsonPath("$[0].state",is("CA")))
		 .andExpect(jsonPath("$[0].country",is("USA")))		
		 .andExpect(jsonPath("$[1].id",is(2)))
		 .andExpect(jsonPath("$[1].github",is(2)))
		 .andExpect(jsonPath("$[1].userName",is("test2UserName")))
		 .andExpect(jsonPath("$[1].firstName",is("test2FirstName")))
		 .andExpect(jsonPath("$[1].lastName",is("test2LastName")))
		 .andExpect(jsonPath("$[1].email",is("test2Email@gmail.com")))
		 .andExpect(jsonPath("$[1].phone",is("9542234567")))		 
		 .andExpect(jsonPath("$[1].status",is("P")))
		 .andExpect(jsonPath("$[1].role",is("V")))
		 .andExpect(jsonPath("$[1].state",is("CA")))
		 .andExpect(jsonPath("$[1].country",is("USA")))
		 .andExpect(jsonPath("$[2].id",is(3)))
		 .andExpect(jsonPath("$[2].github",is(3)))
		 .andExpect(jsonPath("$[2].userName",is("dev3UserName")))
		 .andExpect(jsonPath("$[2].firstName",is("dev3FirstName")))
		 .andExpect(jsonPath("$[2].lastName",is("dev3LastName")))
		 .andExpect(jsonPath("$[2].email",is("dev3Email@gmail.com")))
		 .andExpect(jsonPath("$[2].phone",is("9542234567")))		 
		 .andExpect(jsonPath("$[2].status",is("A")))
		 .andExpect(jsonPath("$[2].role",is("D")))
		 .andExpect(jsonPath("$[2].state",is("CA")))
		 .andExpect(jsonPath("$[2].country",is("USA")))
		 .andExpect(jsonPath("$[3].id",is(4)))
		 .andExpect(jsonPath("$[3].github",is(4)))
		 .andExpect(jsonPath("$[3].userName",is("vol4UserName")))
		 .andExpect(jsonPath("$[3].firstName",is("vol4FirstName")))
		 .andExpect(jsonPath("$[3].lastName",is("vol4LastName")))
		 .andExpect(jsonPath("$[3].email",is("vol4Email@gmail.com")))
		 .andExpect(jsonPath("$[3].phone",is("9542234567")))		 
		 .andExpect(jsonPath("$[3].status",is("D")))
		 .andExpect(jsonPath("$[3].role",is("V")))
		 .andExpect(jsonPath("$[3].state",is("CA")))
		 .andExpect(jsonPath("$[3].country",is("USA")))
		 
		 ; 
		 
		 verify(userServiceMock, times(1)).findAll();
	     verifyNoMoreInteractions(userServiceMock);
		 
	 }
	 
	 @Test	 
	 public void testGetActiveUsers() throws Exception {
	 
		 List<UserDTO> activeUsers = getMockUsers("Active");
		 
		 when(userServiceMock.findActiveUsers()).thenReturn(activeUsers);
		 
		 this.mockMvc.perform(get("/api/users/active")
				 .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))	
		 .andExpect(status().isOk())
		 .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
		 .andExpect(jsonPath("$", hasSize(2)))
		 .andExpect(jsonPath("$[0].id",is(1)))
		 .andExpect(jsonPath("$[0].github",is(1)))
		 .andExpect(jsonPath("$[0].userName",is("test1UserName")))
		 .andExpect(jsonPath("$[0].firstName",is("test1FirstName")))
		 .andExpect(jsonPath("$[0].lastName",is("test1LastName")))
		 .andExpect(jsonPath("$[0].email",is("test1Email@gmail.com")))
		 .andExpect(jsonPath("$[0].phone",is("9542234567")))		 
		 .andExpect(jsonPath("$[0].status",is("A")))
		 .andExpect(jsonPath("$[0].role",is("V")))
		 .andExpect(jsonPath("$[0].state",is("CA")))
		 .andExpect(jsonPath("$[0].country",is("USA")))
		 .andExpect(jsonPath("$[1].id",is(3)))
		 .andExpect(jsonPath("$[1].github",is(3)))
		 .andExpect(jsonPath("$[1].userName",is("dev3UserName")))
		 .andExpect(jsonPath("$[1].firstName",is("dev3FirstName")))
		 .andExpect(jsonPath("$[1].lastName",is("dev3LastName")))
		 .andExpect(jsonPath("$[1].email",is("dev3Email@gmail.com")))
		 .andExpect(jsonPath("$[1].phone",is("9542234567")))		 
		 .andExpect(jsonPath("$[1].status",is("A")))
		 .andExpect(jsonPath("$[1].role",is("D")))
		 .andExpect(jsonPath("$[1].state",is("CA")))
		 .andExpect(jsonPath("$[1].country",is("USA")));
		 
		 verify(userServiceMock, times(1)).findActiveUsers();
	     verifyNoMoreInteractions(userServiceMock);
		 
	 }
	 
	 @Test	
	 public void testGetUserById() throws Exception {
	 
		//Mock user data - user with id = 1
 		 UserDTO userById = getMockUsers("ById").get(0);
		 
		 when(userServiceMock.findById(1)).thenReturn(userById);
		 
		 this.mockMvc.perform(get("/api/users/{id}",1)
				 .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))	
		 .andExpect(status().isOk())
		 .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
		 .andExpect(jsonPath("$.id",is(1)))
		 .andExpect(jsonPath("$.github",is(1)))
		 .andExpect(jsonPath("$.userName",is("test1UserName")))
		 .andExpect(jsonPath("$.firstName",is("test1FirstName")))
		 .andExpect(jsonPath("$.lastName",is("test1LastName")))
		 .andExpect(jsonPath("$.email",is("test1Email@gmail.com")))
		 .andExpect(jsonPath("$.phone",is("9542234567")))		 
		 .andExpect(jsonPath("$.status",is("A")))
		 .andExpect(jsonPath("$.role",is("V")))
		 .andExpect(jsonPath("$.state",is("CA")))
		 .andExpect(jsonPath("$.country",is("USA")));
		 
		 verify(userServiceMock, times(1)).findById(1);
	     verifyNoMoreInteractions(userServiceMock);
		 
	 }
	 
	 @Test	 
	 public void testGetDevelopers()
	 {
		 //code is commented because findDevelopers() method in UserService returns User instead of UserDTO
		 
		//get mock users
		 /*List<UserDTO> developers = getMockUsers("Developers");
		 
		 when(userServiceMock.findDevelopers()).thenReturn(developers);
		 
		 this.mockMvc.perform(get("/api/users/developers")
				 .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))	
		 .andExpect(status().isOk())
		 .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
		 .andExpect(jsonPath("$",hasSize(1)))
		 .andExpect(jsonPath("$[0].github",is(3)))
		 .andExpect(jsonPath("$[0].userName",is("dev3UserName")))
		 .andExpect(jsonPath("$[0].firstName",is("dev3FirstName")))
		 .andExpect(jsonPath("$[0].lastName",is("dev3LastName")))
		 .andExpect(jsonPath("$[0].email",is("dev3Email@gmail.com")))
		 .andExpect(jsonPath("$[0].phone",is("9542234567")))		 
		 .andExpect(jsonPath("$[0].status",is("A")))
		 .andExpect(jsonPath("$[0].role",is("D")))
		 .andExpect(jsonPath("$[0].state",is("CA")))
		 .andExpect(jsonPath("$[0].country",is("USA")));
		 
		 verify(userServiceMock, times(1)).findDevelopers();
	     verifyNoMoreInteractions(userServiceMock);*/
		 
	 }
	 
	 //Testing POST
	 @Test	 
	 public void testCreateUser() throws Exception {
	 
		 //create mock data
		 UserDTO user = getMockUsers("Create").get(0);
		 
		 when(userServiceMock.saveUser(user)).thenReturn(user);
		 
		 this.mockMvc.perform(post("/api/users")
				 .contentType(MediaType.APPLICATION_JSON)
				 .content(asJsonString(user)))
		 .andExpect(status().isCreated())
		 .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
		 .andExpect(jsonPath("$.id",is(1)))
		 .andExpect(jsonPath("$.github",is(1)))
		 .andExpect(jsonPath("$.userName",is("test1UserName")))
		 .andExpect(jsonPath("$.firstName",is("test1FirstName")))
		 .andExpect(jsonPath("$.lastName",is("test1LastName")))
		 .andExpect(jsonPath("$.email",is("test1Email@gmail.com")))
		 .andExpect(jsonPath("$.phone",is("9542234567")))		 
		 .andExpect(jsonPath("$.status",is("A")))
		 .andExpect(jsonPath("$.role",is("V")))
		 .andExpect(jsonPath("$.state",is("CA")))
		 .andExpect(jsonPath("$.country",is("USA")));
		 
		 verify(userServiceMock, times(1)).saveUser(user);
	     verifyNoMoreInteractions(userServiceMock);
				 
	 }
	 
	 //Testing PUT	 
	 @Test
	 public void testUpdateUser() throws Exception {
		 
		 //get mock data
		 UserDTO user = getMockUsers("Update").get(0);
		 
		 when(userServiceMock.saveUser(user)).thenReturn(user);
		 
		 this.mockMvc.perform(put("/api/users")
				 .contentType(MediaType.APPLICATION_JSON)
				 .content(asJsonString(user)))
		 .andExpect(status().isOk())
		 .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
		 .andExpect(jsonPath("$.id",is(1)))
		 .andExpect(jsonPath("$.github",is(1)))
		 .andExpect(jsonPath("$.userName",is("test1UserName")))
		 .andExpect(jsonPath("$.firstName",is("test1FirstName")))
		 .andExpect(jsonPath("$.lastName",is("test1LastName")))
		 .andExpect(jsonPath("$.email",is("test1Email@gmail.com")))
		 .andExpect(jsonPath("$.phone",is("9542234567")))		 
		 .andExpect(jsonPath("$.status",is("A")))
		 .andExpect(jsonPath("$.role",is("V")))
		 .andExpect(jsonPath("$.state",is("CA")))
		 .andExpect(jsonPath("$.country",is("USA")));
		 
		 verify(userServiceMock, times(1)).saveUser(user);
	     verifyNoMoreInteractions(userServiceMock);
				 
	 }
	 
	 
	 //Testing DELETE
	 @Test	 
	 public void testDeleteUser() throws Exception
	 {
		 //get mock data
		 UserDTO user = getMockUsers("Delete").get(0);
		 
		 doNothing().when(userServiceMock).deleteUser(user.getId());
		 
		 this.mockMvc.perform(delete("/api/users/{id}",user.getId())
				 .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
		 .andExpect(status().isOk());
		 
		 verify(userServiceMock, times(1)).deleteUser(user.getId());
	     verifyNoMoreInteractions(userServiceMock);
	 }
	 

	 //Private methods	 
	 List<UserDTO> getMockUsers(String condition)
	 {		 
		//creating mock data
		 //Role - Volunteer and Status - Active
		 UserDTO userDto = new UserDTO();
		 userDto.setCountry("USA");
		 userDto.setDisplayFlag("");
		 userDto.setEmail("test1Email@gmail.com");
		 userDto.setFirstName("test1FirstName");
		 userDto.setGithub(1);
		 userDto.setId(1);
		 userDto.setIntroduction("Full stack developer with 3 years of industry experience");
		 userDto.setLastName("test1LastName");
		 userDto.setLatitude("40.366633");
		 userDto.setLinked_inurl("https://www.linkedin.com/feed/");
		 userDto.setLongitude("74.640832");
		 userDto.setPersonal_web_site("www.mtest.blogspot.com");
		 userDto.setPhone("9542234567");
		 userDto.setResume("Thi$ is a s@mple resume with sPecial ch@r@cters!");
		 userDto.setRole("V");
		 userDto.setSkill1("java");
		 userDto.setSkill2("ruby");
		 userDto.setSkill3("perl");
		 userDto.setSkill4("spring");
		 userDto.setSkill5("struts");
		 userDto.setState("CA");
		 userDto.setStatus("A");
		 userDto.setUserName("test1UserName");
		 userDto.setZip("70701");
		 
		 //Role - Volunteer and Status - pending
		 UserDTO userDto2 = new UserDTO();
		 userDto2.setCountry("USA");
		 userDto2.setDisplayFlag("");
		 userDto2.setEmail("test2Email@gmail.com");
		 userDto2.setFirstName("test2FirstName");
		 userDto2.setGithub(2);
		 userDto2.setId(2);
		 userDto2.setIntroduction("Full stack developer with 3 years of industry experience");
		 userDto2.setLastName("test2LastName");
		 userDto2.setLatitude("40.366633");
		 userDto2.setLinked_inurl("https://www.linkedin.com/feed/");
		 userDto2.setLongitude("74.640832");
		 userDto2.setPersonal_web_site("www.mtest.blogspot.com");
		 userDto2.setPhone("9542234567");
		 userDto2.setResume("Thi$ is a s@mple resume with sPecial ch@r@cters!");
		 userDto2.setRole("V");
		 userDto2.setSkill1("java");
		 userDto2.setSkill2("spring");
		 userDto2.setSkill3("REST");
		 userDto2.setSkill4("MySql");
		 userDto2.setSkill5("Git");
		 userDto2.setState("CA");
		 userDto2.setStatus("P");
		 userDto2.setUserName("test2UserName");
		 userDto2.setZip("70701");
		 
		 //Role - Developer and Status - Active
		 UserDTO userDto3 = new UserDTO();
		 userDto3.setCountry("USA");
		 userDto3.setDisplayFlag("");
		 userDto3.setEmail("dev3Email@gmail.com");
		 userDto3.setFirstName("dev3FirstName");
		 userDto3.setGithub(3);
		 userDto3.setId(3);
		 userDto3.setIntroduction("Full stack developer with 3 years of industry experience");
		 userDto3.setLastName("dev3LastName");
		 userDto3.setLatitude("40.366633");
		 userDto3.setLinked_inurl("https://www.linkedin.com/feed/");
		 userDto3.setLongitude("74.640832");
		 userDto3.setPersonal_web_site("www.mtest.blogspot.com");
		 userDto3.setPhone("9542234567");
		 userDto3.setResume("Thi$ is a s@mple resume with sPecial ch@r@cters!");
		 userDto3.setRole("D");
		 userDto3.setSkill1("java");
		 userDto3.setSkill2("spring");
		 userDto3.setSkill3("REST");
		 userDto3.setSkill4("MySql");
		 userDto3.setSkill5("Git");
		 userDto3.setState("CA");
		 userDto3.setStatus("A");
		 userDto3.setUserName("dev3UserName");
		 userDto3.setZip("70701");
		 
		//Role - Volunteer and Status - Deleted
		 UserDTO userDto4 = new UserDTO();
		 userDto4.setCountry("USA");
		 userDto4.setDisplayFlag("");
		 userDto4.setEmail("vol4Email@gmail.com");
		 userDto4.setFirstName("vol4FirstName");
		 userDto4.setGithub(4);
		 userDto4.setId(4);
		 userDto4.setIntroduction("Full stack developer with 3 years of industry experience");
		 userDto4.setLastName("vol4LastName");
		 userDto4.setLatitude("40.366633");
		 userDto4.setLinked_inurl("https://www.linkedin.com/feed/");
		 userDto4.setLongitude("74.640832");
		 userDto4.setPersonal_web_site("www.mtest.blogspot.com");
		 userDto4.setPhone("9542234567");
		 userDto4.setResume("Thi$ is a s@mple resume with sPecial ch@r@cters!");
		 userDto4.setRole("V");
		 userDto4.setSkill1("java");
		 userDto4.setSkill2("spring");
		 userDto4.setSkill3("REST");
		 userDto4.setSkill4("MySql");
		 userDto4.setSkill5("Git");
		 userDto4.setState("CA");
		 userDto4.setStatus("D");
		 userDto4.setUserName("vol4UserName");
		 userDto4.setZip("70701");
		 
		 if(condition == "Active")
		 {
			 return Arrays.asList(userDto, userDto3);
		 }
		 else if(condition == "Developers")
		 {
			 return Arrays.asList(userDto3);
		 }
		 else if(condition == "ById")
		 {
			 return Arrays.asList(userDto);
		 }
		 else if(condition == "Create")
		 {
			 return Arrays.asList(userDto);
		 }
		 else if(condition == "Update")
		 {
			 return Arrays.asList(userDto);
		 }
		 else if(condition == "Delete")
		 {
			 return Arrays.asList(userDto);
		 }
		 else
		 {
			 //returns all users
			 return Arrays.asList(userDto, userDto2, userDto3, userDto4);
		 }
	 }
	 
	 static String asJsonString(final Object obj) {
	        try {
	            return new ObjectMapper().writeValueAsString(obj);
	        } catch (Exception e) {
	            throw new RuntimeException(e);
	        }
	    }
	 
	 
	 
}
