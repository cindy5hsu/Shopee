package com.example.dao;

import java.util.List;

import com.example.dto.OrderQueryParams;
import com.example.model.Order;
import com.example.model.OrderItem;

public interface OrderDao {

	Integer countOrder(OrderQueryParams orderQueryParams);

	List<Order> getOrders(OrderQueryParams orderQueryParams);

	List<Order> getAllOrders(OrderQueryParams orderQueryParams);

	Order getOrderById(Integer orderId);

	List<OrderItem> getOrderItemsByOrderId(Integer orderId);

	Integer createOrder(Integer userId, Integer totalAmount);

	void createOrderItems(Integer orderId, List<OrderItem> orderItemList);

}
