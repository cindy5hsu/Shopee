package com.example.dto;

import lombok.Data;

@Data
public class CartQueryParams {
	private Integer userId;
	private Integer limit;
	private Integer offset;

}
