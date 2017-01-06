package org.c4sg.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.c4sg.dao.ProjectDao;
import org.c4sg.dto.ProjectDto;
import org.c4sg.entity.Project;
import org.c4sg.mapper.ProjectMapper;
import org.c4sg.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectServiceImpl implements ProjectService {

	@Autowired
	private ProjectDao projectDao;
	
	@Autowired
	private ProjectMapper projectMapper;
	
	public void save(Project project) {
		projectDao.save(project);
    }

	public List<ProjectDto> findProjects() {
		List<Project> projects = projectDao.findAll();
		List<ProjectDto> projectDtos = projects.stream()
									.map(p -> projectMapper.getProjectDtoFromEntity(p))
									.collect(Collectors.toList());
		return projectDtos;
	}
	
	/*public List<Project> findProjects() {
		List<Project> projects = projectDao.findAll();
		//projects.forEach(p -> p.setOrganizationName(p.getOrganization().getName()));
		return projects;
	}*/
	
    public Project findById(int id) {
        return projectDao.findById(id);
    }
    
    public Project findByName(String name) {
        return projectDao.findByName(name);
    }
    
    //TODO search by keyword
    public List<Project> findByKeyword(String keyWord) {
        //return projectDao.findByKeyWord(keyWord);
    	List<Project> projects = new ArrayList<>();
    	projects.add(projectDao.findByName(keyWord));
    	return projects;
    }
    
    public Project createProject(Project project) {
    	Project localProject = projectDao.findById(project.getId());

        if (localProject != null) { 
        	System.out.println("Project already exist.");
        } else {
            localProject = projectDao.save(project);
        }

        return localProject;
    }
    
    public void deleteProject(int id) {
    	Project localProject = projectDao.findById(id);

        if (localProject != null) {
        	projectDao.delete(localProject);
        } else {
        	System.out.println("Project does not exist.");
        }
    }
    
    public Project updateProject(Project project) {
    	Project localProject = projectDao.findById(project.getId());

        if (localProject != null) {
        	localProject = projectDao.save(project);
        } else {
        	System.out.println("Project does not exist.");
        }

        return localProject;
    }

}
