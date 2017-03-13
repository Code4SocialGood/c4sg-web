package org.c4sg.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.c4sg.dto.TitleDTO;
import org.c4sg.service.TitleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/titles")
@Api(description = "Operations about Titles", tags = "title")
public class TitleController {

    @Autowired
    private TitleService titleService;

    @CrossOrigin
    @RequestMapping(value = "/all", produces = {"application/json"}, method = RequestMethod.GET)
    @ApiOperation(value = "Find all titles", notes = "Returns a collection of titles (alphabetical)")
    public List<TitleDTO> getTitles() {
        return titleService.findTitles();
    }
}