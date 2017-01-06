package org.c4sg.service;

import java.util.List;

import org.c4sg.dto.ProjectDto;
import org.c4sg.entity.Project;

public interface ProjectService {

    public List<ProjectDto> findProjects();
    public Project findById(int id);
    public Project findByName(String name);
    public List<Project> findByKeyword(String keyWord);
    
    public Project createProject(Project project);
    public void deleteProject(int id);
    public Project updateProject(Project project);
	public void save(Project project);
}
