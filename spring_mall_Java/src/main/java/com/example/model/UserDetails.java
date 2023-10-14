package com.example.model;

import java.util.Date;

import lombok.Data;

@Data
public class UserDetails {
	private Integer userdDetailsId;
	private Integer userId;
	private String name;
	private String address;
	private String phone;
	private String email;
	private Date createdDate; 

}
