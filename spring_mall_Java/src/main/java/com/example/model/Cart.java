package com.example.model;

import java.sql.Timestamp;
import java.util.List;

import lombok.Data;

@Data
public class Cart {
	private Integer cartId;
	private Integer userId;
	private Integer totalAmount;
	private Timestamp createDate;
	private Timestamp lastModifiedDate;
	
	private List<CartItem> cartItemList;

}
