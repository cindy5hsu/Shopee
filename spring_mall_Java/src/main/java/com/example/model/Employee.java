package com.example.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Employee {
	private Integer employeeId;
	
	@JsonProperty("e_mail")
	private String email;
	@JsonIgnore //隱藏賬號的值
	private String password;
	private String jobtitle;

}
