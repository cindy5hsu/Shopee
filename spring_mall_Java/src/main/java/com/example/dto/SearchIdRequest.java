package com.example.dto;

import lombok.Data;

@Data
public class SearchIdRequest {
	private Integer userId;
	
	private Integer productId;
	
	private Integer orderId;
	
	private Integer cartId;

}
