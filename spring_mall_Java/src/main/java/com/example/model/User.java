package com.example.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class User {
	
	private Integer userId;
	
	@JsonProperty("e_mail")
	private String email;
	//spring boot 在轉換 userobject 轉換成爲 json 格式的時候，會忽略pasword 的變數
	@JsonIgnore
	private String password;
	private Date createdDate;
	private Date lastModifiedDate;

}
