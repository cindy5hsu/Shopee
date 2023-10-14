package com.example.service;

import java.util.List;

import com.example.dto.CreateOrderRequest;
import com.example.dto.OrderQueryParams;
import com.example.model.Order;

public interface OrderService {
	
	Integer countOrder(OrderQueryParams orderQueryParams);
	
	List<Order> getOrders(OrderQueryParams orderQueryParams);
	
	List<Order> getAllOrders(OrderQueryParams orderQueryParams);

	
	Order getOrderById(Integer orderId);
	
	Integer createOrder(Integer userId, CreateOrderRequest createOrderRequest);

}
