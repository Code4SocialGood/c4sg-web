package org.c4sg.validator;

import org.c4sg.dao.UserDao;
import org.c4sg.dto.UserDto;
import org.c4sg.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class UserValidator implements Validator {

    private final UserDao userDao;
  
    @Autowired
    public UserValidator(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz.equals(UserDto.class);
    }

    @Override
    public void validate(Object target, Errors errors) {
    	boolean userExistInDB = false;
    	 UserDto userDto = (UserDto) target;
    	 System.out.println("User Password :: "+userDto.getPassword());
    	 User user = userDao.findByName(userDto.getName());
    	 if(user != null)
    	{
    		 System.out.println("*********User exist in DB*******");
    		 userExistInDB = true;
    		   	
    	}
        
    	 validatePasswords(errors, userDto,user,userExistInDB);
	     validateEmail(errors, userDto,userExistInDB);
	
	     
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "NotEmpty");
        if (userDto.getName().length() < 6 || userDto.getName().length() > 32) {
            errors.rejectValue("name", "Username should have value");
        }
    /*   
     * Used for existing user
     * 
     *  
     *  if (userDao.findByName(userDto.getName()) != null) {
            errors.rejectValue("name", "UserName already exist");
        }*/

      


    }

 
  
    private void validatePasswords(Errors errors, UserDto userDto,User user,boolean userExistInDB) {
        if (!userExistInDB)
        {
        		if(!userDto.getPassword().equals(userDto.getRpassword())) {
            errors.reject("password.no_match", "Passwords do not match");
        		}
        }
        else
        {
        	System.out.println("User password :: "+userDto.getPassword());
        	System.out.println("User DB password :: "+user.getPassword());
        	if(!userDto.getPassword().equals(user.getPassword()))
    		{
    			errors.rejectValue("password", "Username or password is not valid");
    		}
        }
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "NotEmpty");
        if (userDto.getPassword().length() < 8 || userDto.getPassword().length() > 32) {
            errors.rejectValue("password", "Password length should be 8-32 chars");
        }
    }
 
    private void validateEmail(Errors errors, UserDto userDto,boolean userExistInDB) {
    	if(!userExistInDB)
    	{
    	ValidationUtils.rejectIfEmptyOrWhitespace(errors, "email", "","Email is empty");
		if (!userDto.getEmail().contains("@")) {
			errors.rejectValue("email","", "Email is not valid.");
		}
		}

    }
    
}