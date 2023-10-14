package com.example.model;

import lombok.Data;

@Data
public class CartItem {
	private Integer cartItemId;
	private Integer cartId;
	private Integer productId;
	private Integer quantity;
	private Integer amount;
	
	private String productName;
	private String imageUrl;
	private Integer price;
	//private String CategoryName;
}
