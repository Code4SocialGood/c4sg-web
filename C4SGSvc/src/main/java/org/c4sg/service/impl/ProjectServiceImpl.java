package org.c4sg.service.impl;

import static java.util.Objects.nonNull;
import static java.util.Objects.requireNonNull;
import static org.c4sg.constant.UserProjectStatus.APPLIED;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.c4sg.dao.ProjectDAO;
import org.c4sg.dao.UserDAO;
import org.c4sg.dao.UserProjectDAO;
import org.c4sg.dto.ProjectDTO;
import org.c4sg.entity.Project;
import org.c4sg.entity.User;
import org.c4sg.entity.UserProject;
import org.c4sg.exception.UserProjectException;
import org.c4sg.mapper.ProjectMapper;
import org.c4sg.service.AsyncEmailService;
import org.c4sg.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectDAO projectDAO;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private UserProjectDAO userProjectDAO;

    @Autowired
    private ProjectMapper projectMapper;

    @Autowired
    private AsyncEmailService asyncEmailService;

    public void save(Project project) {
        projectDAO.save(project);
    }

    public List<ProjectDTO> findProjects() {
        List<Project> projects = projectDAO.findAll();
        return projectMapper.getDtosFromEntities(projects);
    }

    public Project findById(int id) {
        return projectDAO.findById(id);
    }

    public Project findByName(String name) {
        return projectDAO.findByName(name);
    }

    //TODO search by keyword
    public List<Project> findByKeyword(String keyWord) {
        List<Project> projects = new ArrayList<>();
        projects.add(projectDAO.findByName(keyWord));
        return projects;
    }

    public Project createProject(Project project) {
        Project localProject = projectDAO.findById(project.getId());

        if (localProject != null) {
            System.out.println("Project already exist.");
        } else {
            localProject = projectDAO.save(project);
        }

        return localProject;
    }

    public void deleteProject(int id) {
        Project localProject = projectDAO.findById(id);

        if (localProject != null) {
            projectDAO.delete(localProject);
        } else {
            System.out.println("Project does not exist.");
        }
    }

    public Project updateProject(Project project) {
        Project localProject = projectDAO.findById(project.getId());

        if (localProject != null) {
            localProject = projectDAO.save(project);
        } else {
            System.out.println("Project does not exist.");
        }

        return localProject;
    }

    @Override
    public ProjectDTO saveUserProject(Integer userId, Integer projectId) {
        User user = userDAO.findById(userId);
        requireNonNull(user, "Invalid User Id");
        Project project = projectDAO.findById(projectId);
        requireNonNull(project, "Invalid Project Id");
        isUserAppliedPresent(userId, projectId);
        UserProject userProject = new UserProject();
        userProject.setUser(user);
        userProject.setProject(project);
        userProject.setStatus(APPLIED.getStatus());
        apply(user, project);
        userProjectDAO.save(userProject);

        return projectMapper.getProjectDtoFromEntity(project);
    }

    @Override
    public void apply(User user, Project project) {
        String from = "code4socialgood@code4socialgood.com";
        String orgEmail = project.getEmail();
        String orgSubject = "You received an application from Code for Social Good";
        String orgText = "You received an application from Code for Social Good. " +
                "Please login to the dashboard to review the application.";
        asyncEmailService.send(from, orgEmail, orgSubject, orgText);

        String userEmail = user.getEmail();
        String userSubject = "You submitted an application from Code for Social Good";
        String userText = "You submitted an application from Code for Social Good. " +
                "Organization is notified to review your application and contact you.";
        asyncEmailService.send(from, userEmail, userSubject, userText);
    }

    private void isUserAppliedPresent(Integer userId, Integer projectId) throws UserProjectException {
        UserProject userProject = userProjectDAO.findByUser_IdAndProject_Id(userId, projectId);
        if(nonNull(userProject)){
            throw new UserProjectException("The user already exists in that project");
        }
    }

    @Override
    public List<ProjectDTO> getAppliedProjects(Integer userId){
        List<Project> projects = projectDAO.findByStatus(userId, APPLIED.getStatus());
        return projectMapper.getDtosFromEntities(projects);
    }

	@Override
	public List<Project> getProjectsByOrganization(Integer orgId) {
		List<Project> projects = projectDAO.getProjectsByOrganization(orgId);
		if(projects == null || projects.size() == 0) {
			System.out.println("No Project available for the provided organization");
		}
		return projects;
	}

	@Override
	public List<ProjectDTO> findByUser(Integer userId) {
		User user = userDAO.findById(userId);
        requireNonNull(user, "Invalid User Id");
		List<UserProject> userProjects = userProjectDAO.findByUserId(userId);
		Comparator<UserProject> projectComp = new Comparator<UserProject>() {
			@Override
			public int compare(UserProject o1, UserProject o2) {
				int result = 0;
				result = o1.getStatus().compareTo(o2.getStatus());
				return result*-1;
			}
		};
		Collections.sort(userProjects, projectComp);
		List<ProjectDTO> projectDtos = new ArrayList<ProjectDTO>();
		for(UserProject userProject: userProjects) {
			projectDtos.add(projectMapper.getProjectDtoFromEntity(userProject));
		}
		return projectDtos;
	}
}
