package org.c4sg.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.c4sg.dto.SkillDTO;
import org.c4sg.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/skills")
@Api(description = "Operations about Skills", tags = "skill")
public class SkillController {

    @Autowired
    private SkillService skillService;

    @CrossOrigin
    @RequestMapping(value = "/all", produces = {"application/json"}, method = RequestMethod.GET)
    @ApiOperation(value = "Find all skills", notes = "Returns a collection of skills (alphabetical)")
    public List<SkillDTO> getSkills() {
        return skillService.findSkills();
    }
}