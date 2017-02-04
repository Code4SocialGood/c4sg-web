package org.c4sg.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.c4sg.dao.UserDao;
import org.c4sg.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired 
	UserDao userRepository;
	@Override
	@Transactional(readOnly = true)
	public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
		return null;
			/*	        User user = userRepository.findByName(name);

		        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
		        for (Role role : user.getRoles()){
		            grantedAuthorities.add(new SimpleGrantedAuthority(role.getName()));
		        }
                
		        return new org.springframework.security.core.userdetails.User(user.getName(), user.getPassword());
		    */
		
	}}


