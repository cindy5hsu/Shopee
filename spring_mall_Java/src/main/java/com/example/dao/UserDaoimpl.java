package com.example.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import com.example.dto.CreateUserDetailsRequest;
import com.example.dto.UserRegisterRequest;
import com.example.model.User;
import com.example.model.UserDetails;
import com.example.rowmapper.UserDetailsRowMapper;
import com.example.rowmapper.UserRowMapper;

@Component
public class UserDaoimpl implements UserDao {
	@Autowired
	private NamedParameterJdbcTemplate namepjt;

	@Override
	public User getUserById(Integer userId) {
//		String sql = "SELECT user_id, email, password, created_date, last_modified_date"
//				+ " FROM user WHERE user_id = :userId";

		String sql = "SELECT u.user_id, u.email, u.password, ud.name, ud.address, ud.phone, u.created_date, u.last_modified_date"
				+ " FROM user u" + " LEFT JOIN user_details ud ON u.user_id = ud.user_id"
				+ " WHERE u.user_id = :userId";

		Map<String, Object> map = new HashMap<>();
		map.put("userId", userId);

		// 使用 UserRowMapper 將資料庫的結果轉換成爲 List<user>
		List<User> userList = namepjt.query(sql, map, new UserRowMapper());

		if (userList.size() > 0) {
			return userList.get(0);
		} else {
			return null;
		}
	}



	@Override
	public User getUserByEmail(String email) {
		String sql = "SELECT user_id, email, password, created_date, last_modified_date"
				+ " FROM user WHERE email = :email";
//		String sql = "SELECT user_id, email, password, name, address, phone, created_date, last_modified_date"
//		        + " FROM user WHERE user_id = :userId"; // 和另一個方法對應的SQL

		Map<String, Object> map = new HashMap<>();
		map.put("email", email);
		// 使用 UserRowMapper 將資料庫的結果轉換成爲 List<user>
		List<User> userList = namepjt.query(sql, map, new UserRowMapper());

		if (userList.size() > 0) {
			return userList.get(0);
		} else {
			return null;
		}

	}
	




	@Override
	public Integer createUser(UserRegisterRequest userRegisterRequest) {
		// Dao 層只是會和資料庫溝通，複雜的判斷邏輯只是會在service層裏面
		// 用service 層傳過來的參數，去對資料庫進行操作，不會在DAO 檢查賬號、密碼
//		String sql = "INSERT INTO user(email, password, created_date, last_modified_date)"
//				+ " VALUES (:email, :password, :createdDate, :lastModifiedDate)";

		String sql = "INSERT INTO user(email, password, created_date, last_modified_date)"
				+ " VALUES (:email, :password, :createdDate, :lastModifiedDate)";
		Map<String, Object> map = new HashMap<>();
		map.put("email", userRegisterRequest.getEmail());
		map.put("password", userRegisterRequest.getPassword());
		Date now = new Date();
		map.put("createdDate", now);
		map.put("lastModifiedDate", now);

		KeyHolder keyHolder = new GeneratedKeyHolder();

		namepjt.update(sql, new MapSqlParameterSource(map), keyHolder);

		// 可以接住mysql 自動生成的 userId
		int userId = keyHolder.getKey().intValue();

		return userId;
	}
	
	@Override
	public List<UserDetails> getUsersDetails(CreateUserDetailsRequest createUserDetailsRequest) {
		String sql = "SELECT u.user_id, u.email, u.created_date, ud.user_details_id, ud.name, ud.address, ud.phone "
	               + "FROM user u "
	               + "JOIN user_details ud ON u.user_id = ud.user_id WHERE 1=1 ";

	    Map<String, Object> map = new HashMap<>();

	    List<UserDetails> userList = namepjt.query(sql, map, new UserDetailsRowMapper());
	    
	    return userList;
	}



	@Override
	public UserDetails findUserDetailsByUserId(Integer userId) {
//		String sql =  "SELECT user_details_id, user_id, name, address, phone"
//		           + " FROM user_details WHERE user_id = :userId";
		
		// 使用 JOIN 语法将 user 和 user_details 表连接在一起
	    String sql = "SELECT u.user_id, u.email, u.created_date, ud.user_details_id, ud.name, ud.address, ud.phone "
	               + "FROM user u "
	               + "JOIN user_details ud ON u.user_id = ud.user_id "
	               + "WHERE u.user_id = :userId";
//				"SELECT ud.user_detail_id, ud.user_id, ud.name, ud.address, ud.phone"
//	            + " FROM user_details as ud"
//	            + " WHERE ud.user_id = :userId";
				
//				"SELECT ud.user_detail_id, ud.user_id, ud.name, ud.address, ud.phone"
//	            + " FROM userdetails as ud"
//	            + " WHERE ud.user_id = :userId";
		
	    Map<String, Object> map = new HashMap<>();
	    map.put("userId", userId);

	    try {
	        return namepjt.queryForObject(sql, map, new UserDetailsRowMapper());
	    } catch (EmptyResultDataAccessException e) {
	        // 处理没有找到用户详细信息的情况
	        return null;
	    }
	}


	@Override
	public Integer createUserDetail(Integer userId, CreateUserDetailsRequest createUserDetailsRequest) {
		String sql = "INSERT INTO user_details(user_id, name, address, phone)"
				+ " VALUES (:user_id, :name, :address, :phone)";
		Map<String, Object> map = new HashMap<>();
		map.put("user_id", userId);
		map.put("name", createUserDetailsRequest.getName());
		map.put("address", createUserDetailsRequest.getAddress());
		map.put("phone", createUserDetailsRequest.getPhone());

		KeyHolder keyHolder = new GeneratedKeyHolder();

		namepjt.update(sql, new MapSqlParameterSource(map), keyHolder);

		// 可以接住mysql 自動生成的 userId
		return keyHolder.getKey().intValue();
	}


	@Override
	public void updatedUserDetails(Integer userId, CreateUserDetailsRequest createUserDetailsRequest) {
	    // 参数验证
	    if (userId == null || createUserDetailsRequest == null) {
	        throw new IllegalArgumentException("Invalid arguments");
	    }

	    String sql = "UPDATE user_details SET name = :name, address = :address, phone = :phone "
	            + "WHERE user_id = :user_id";

	    Map<String, Object> map = new HashMap<>();
	    map.put("user_id", userId);
	    map.put("name", createUserDetailsRequest.getName());
	    map.put("address", createUserDetailsRequest.getAddress());
	    map.put("phone", createUserDetailsRequest.getPhone());

	    try {
	        namepjt.update(sql, map);
	    } catch (DataAccessException e) {
	        // 添加适当的错误处理
	        throw new RuntimeException("Database update failed", e);
	    }
	}


}
