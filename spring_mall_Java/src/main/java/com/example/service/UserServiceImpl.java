package com.example.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;
import org.springframework.web.server.ResponseStatusException;

import com.example.dao.UserDao;
import com.example.dto.CreateUserDetailsRequest;
import com.example.dto.UserLoginRequest;
import com.example.dto.UserRegisterRequest;
import com.example.model.User;
import com.example.model.UserDetails;

@Component
public class UserServiceImpl implements UserService{
	
	private final static Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public User getUserById(Integer userId) {
		return userDao.getUserById(userId);
	}

	@Override
	public Integer register(UserRegisterRequest userRegisterRequest) {
		//檢查注冊的 email
        User user = userDao.getUserByEmail(userRegisterRequest.getEmail());
        
        if(user != null) {
        	//是一個警告的 warn 用，{} 表示變數的取得後面參數的值
        	log.warn("該 email {} 已經被注冊", userRegisterRequest.getEmail());
        	throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        //使用 MD5 生成密碼的雜凑值                          將字串轉換成爲 bytes 類型
        String hashPassword = DigestUtils.md5DigestAsHex(userRegisterRequest.getPassword().getBytes());
        userRegisterRequest.setPassword(hashPassword);
		//創建賬號
		return userDao.createUser(userRegisterRequest);
	}

	@Override
	public User login(UserLoginRequest userLoginRequest) {
		//先使用 Dao 層的getUserByEmail方法，前端傳過來Email都值去資料庫中查詢user 數據出來
		//在Dao 層不能去添加 if else 的判段在裏面
		User user = userDao.getUserByEmail(userLoginRequest.getEmail());
		
		//檢查 user 是否存在
		if(user == null) {
			log.warn("該 email {} 尚未注冊", userLoginRequest.getEmail()  );
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
		
		//使用 MD5 生成密碼的雜凑值
		String hashedPassword = DigestUtils.md5DigestAsHex(userLoginRequest.getPassword().getBytes());
		
		//比較密碼 比較hash 過的密碼
		//if user在資料庫中所存儲的password的值 = 前端所回傳過來的 password 的值的話
		if (user.getPassword().equals(hashedPassword)) {
			return user;
		}else {
			log.warn("email {} 的密碼不正確", userLoginRequest.getEmail());
			//强制停止前端的請求
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
	}
	
	
	@Override
	public List<UserDetails> getUsersDetails(CreateUserDetailsRequest createUserDetailsRequest) {
		return userDao.getUsersDetails(createUserDetailsRequest);
	}

	@Override
	public UserDetails findUserDetailsByUserId(Integer userId) {
		return userDao.findUserDetailsByUserId(userId);
	}

	@Override
	public Integer createUserDetail(Integer userId, CreateUserDetailsRequest createUserDetailsRequest) {
	    // 檢查 user 是否存在
	    User user = userDao.getUserById(userId);
	    
	    if(user == null) {
	        log.warn("該 userId {} 不存在", userId);
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
	    }
	    
	    UserDetails userDetails = new UserDetails();
	    userDetails.setUserId(userId);
	    userDetails.setName(createUserDetailsRequest.getName());
	    userDetails.setAddress(createUserDetailsRequest.getAddress());
	    userDetails.setPhone(createUserDetailsRequest.getPhone());

	    Integer userdetailsId = userDao.createUserDetail(userId, createUserDetailsRequest);


	    return userdetailsId; // 返回新创建的 UserDetails 的 userId
	}

	@Override
	public void updatedUserDetails(Integer userId, CreateUserDetailsRequest createUserDrtailsRequest) {
		userDao.updatedUserDetails(userId, createUserDrtailsRequest);
//	    return userDao.findUserDetailsByUserId(userId);
	}

}
