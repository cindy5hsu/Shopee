package com.example.service;

import java.util.List;

import com.example.dto.CreateUserDetailsRequest;
import com.example.dto.UserLoginRequest;
import com.example.dto.UserRegisterRequest;
import com.example.model.User;
import com.example.model.UserDetails;

public interface UserService {
	
	User getUserById(Integer userId);
	
	Integer register(UserRegisterRequest userRegisterRequest);
	
	List<UserDetails> getUsersDetails(CreateUserDetailsRequest createUserDetailsRequest);
	
	//返回值 方法名稱 參數
	User login(UserLoginRequest userLoginRequest);
		
	UserDetails findUserDetailsByUserId(Integer userId);
	
	Integer createUserDetail(Integer userId, CreateUserDetailsRequest createUserDrtailsRequest);
	
	void updatedUserDetails(Integer userId, CreateUserDetailsRequest createUserDrtailsRequest);
}
