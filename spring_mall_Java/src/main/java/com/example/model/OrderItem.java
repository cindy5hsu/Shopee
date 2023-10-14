package com.example.model;

import lombok.Data;

@Data
public class OrderItem {
	private Integer orderItemId;
	private Integer orderId;
	private Integer productId;
	private Integer quantity;
	private Integer amount;
	private String productName;
	private String imageUrl;

}
