package org.cs4g;

import org.c4sg.C4SgApplication;
import org.c4sg.controller.ProjectController;
import org.c4sg.service.ProjectService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {C4SgApplication.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ProjectControllerTest {

    @Autowired
    private ProjectController projectController;

    private MockMvc mockMvc;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(projectController).build();
    }

    @Test
    public void testGetAll() throws Exception {
        //Mocking Controller
        this.mockMvc.perform(get("/api/projects/all")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$", hasSize(5)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("WebSite Construction")))
                .andExpect(jsonPath("$[0].organizationId", is("1")))
                .andExpect(jsonPath("$[0].image", is("assets/project/Project_TeensGive.png")))
                .andExpect(jsonPath("$[0].description", is("Development of a new website based on one of the available CMS website templates (such as Wordpress, Squarespace, or Drupal. Training to ensure Organization's staff members can update content and manage the site post-launch. Note: Only includes websites built on CMS based platforms. This is not a website from scratch.")))
                .andExpect(jsonPath("$[0].status", is("A")))
                .andExpect(jsonPath("$[0].organizationName", is("Teens Give")))
                .andExpect(jsonPath("$[1].id", is(3)))
                .andExpect(jsonPath("$[1].organizationName", is("AFRICAN FILM FESTIVAL, INC.")))
                .andExpect(jsonPath("$[2].id", is(13)))
                .andExpect(jsonPath("$[2].organizationName", is("NATIONAL ASSOCIATION OF SCHOOL NURSES")))
                .andExpect(jsonPath("$[3].id", is(14)))
                .andExpect(jsonPath("$[3].organizationName", is("RUBICON PROGRAMS INC.")))
                .andExpect(jsonPath("$[4].id", is(15)))
                .andExpect(jsonPath("$[4].organizationName", is("Conversations For Good")));
    }


}
