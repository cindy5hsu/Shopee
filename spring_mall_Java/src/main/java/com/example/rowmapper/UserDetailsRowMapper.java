package com.example.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.example.model.UserDetails;


public class UserDetailsRowMapper implements RowMapper<UserDetails>{
	@Override
    public UserDetails mapRow(ResultSet resultSet, int i) throws SQLException {
		UserDetails userdetails = new UserDetails();
		userdetails.setUserdDetailsId(resultSet.getInt("user_details_id")); 
		userdetails.setUserId(resultSet.getInt("user_id"));
		userdetails.setName(resultSet.getString("name"));
		userdetails.setAddress(resultSet.getString("address"));
		userdetails.setPhone(resultSet.getString("phone"));
		userdetails.setEmail(resultSet.getString("email"));
        userdetails.setCreatedDate(resultSet.getTimestamp("created_date")); // 假设 UserDetails 中的 createdDate 是 Timestamp 类型
		
		return userdetails;	
	}
}
