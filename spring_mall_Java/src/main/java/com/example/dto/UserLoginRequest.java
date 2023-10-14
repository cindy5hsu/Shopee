package com.example.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class UserLoginRequest {
	@NotBlank
	@Email
	private String email;
	
	@NotBlank
	private String password;

}
