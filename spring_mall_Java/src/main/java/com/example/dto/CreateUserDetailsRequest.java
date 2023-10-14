package com.example.dto;

import lombok.Data;

@Data
public class CreateUserDetailsRequest {
	private String name;
	private String address;
	private String phone;

}
