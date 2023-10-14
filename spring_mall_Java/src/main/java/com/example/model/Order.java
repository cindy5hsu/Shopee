package com.example.model;

import java.sql.Timestamp;
import java.util.List;

import lombok.Data;

@Data
public class Order {
	
	private Integer orderId;
	private Integer userId;
	private String email;
	private Integer totalAmount;
	private Timestamp createDate;
	private Timestamp lastModifiedDate;
	//private String name;
	private List<OrderItem> orderItemList;
	

}
