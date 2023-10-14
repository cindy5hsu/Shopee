package com.example.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class UserRegisterRequest {
	@NotBlank
	@Email
	private String email;
	
	@NotBlank
	private String password;
	

    @NotBlank
    private String confirmPassword;

}
