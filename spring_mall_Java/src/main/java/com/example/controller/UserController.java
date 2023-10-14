  package com.example.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.CreateUserDetailsRequest;
import com.example.dto.SearchIdRequest;
import com.example.dto.UserLoginRequest;
import com.example.dto.UserRegisterRequest;
import com.example.model.User;
import com.example.model.UserDetails;
import com.example.service.UserService;
@RestController
@CrossOrigin(origins = "*")
public class UserController {
	@Autowired
	private UserService  userService;

	@PostMapping("/users/register")
	public ResponseEntity<User> register(@RequestBody @Valid UserRegisterRequest userRegisterRequest) {
	    
	    // 检查密码和确认密码是否相等
	    if (!userRegisterRequest.getPassword().equals(userRegisterRequest.getConfirmPassword())) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // 返回400错误
	    }
	    
	    Integer userId = userService.register(userRegisterRequest);
	    User user = userService.getUserById(userId);
	    
	    return ResponseEntity.status(HttpStatus.CREATED).body(user);
	}

	@PostMapping("/users/login")
	//@RequestBody接住前端所傳過來的參數，@Valid 驗證post請求requestbody 的參數
	public ResponseEntity<User> login(@RequestBody @Valid  UserLoginRequest userLoginRequest) {
		User user = userService.login(userLoginRequest);
		
		return ResponseEntity.status(HttpStatus.OK).body(user);
	}
	
	 @GetMapping("/usersdetails")
	    public ResponseEntity<List<UserDetails>> getUsersDetails(
	            @RequestParam(required = false) String search, // 可选的搜索参数
	            @RequestParam(defaultValue = "created_date") String orderBy, // 默认按创建日期排序
	            @RequestParam(defaultValue = "desc") String sort // 默认降序
	    ) {
	        CreateUserDetailsRequest createUserDetailsRequest = new CreateUserDetailsRequest();

	        List<UserDetails> userDetailsList = userService.getUsersDetails(createUserDetailsRequest);

	        return new ResponseEntity<>(userDetailsList, HttpStatus.OK);
	    }
	
	@PostMapping("/user/userdetails")
	public ResponseEntity<UserDetails> findUserDetailsByUserId(@RequestBody @Valid SearchIdRequest searchIdRequest){
		Integer userId = searchIdRequest.getUserId(); 
	    UserDetails userDetails = userService.findUserDetailsByUserId(userId);
		
	    if(userDetails != null) {
	        return ResponseEntity.status(HttpStatus.OK).body(userDetails); 
	    }
	    else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }
		
	}
	@PostMapping("/user/{userId}/userdetails")
	public ResponseEntity<?> createUserDetails(@PathVariable Integer userId,
	                                           @RequestBody @Valid CreateUserDetailsRequest createUserDetailsRequest) {
	    
	    Integer newUserId = userService.createUserDetail(userId, createUserDetailsRequest);	    
	    
	    return ResponseEntity.status(HttpStatus.OK).body(newUserId);
	}

	@PutMapping("/user/{userId}/userdetails")
    public ResponseEntity<UserDetails> updateUserDetails(@PathVariable Integer userId,
                                                         @RequestBody @Valid CreateUserDetailsRequest request) {
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        userService.updatedUserDetails(userId, request);
        return ResponseEntity.ok().build();  
    }

}
