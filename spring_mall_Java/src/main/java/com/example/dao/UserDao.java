package com.example.dao;

import java.util.List;

import com.example.dto.CreateUserDetailsRequest;
import com.example.dto.UserRegisterRequest;
import com.example.model.User;
import com.example.model.UserDetails;


public interface UserDao {
	
	User getUserById(Integer userId);
	
	User getUserByEmail(String email);
	
	List<UserDetails> getUsersDetails(CreateUserDetailsRequest createUserDetailsRequest);
	
	Integer createUser(UserRegisterRequest userRegisterRequest);
	
	UserDetails findUserDetailsByUserId(Integer userId);
	
	Integer createUserDetail(Integer uesrId, CreateUserDetailsRequest createUserDetailsRequest);
	
	void updatedUserDetails(Integer userId, CreateUserDetailsRequest createUserDrtailsRequest);

}
