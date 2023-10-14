package com.example.controller;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.CreateOrderRequest;
import com.example.dto.OrderQueryParams;
import com.example.model.Order;
import com.example.service.OrderService;
import com.example.util.Page;

@RestController //是用來處理 RESTful API 的請求

@CrossOrigin(origins = "*") 
public class OrderController {
	//會自動注入
	@Autowired
	private OrderService orderService;

	@GetMapping("/users/{userId}/orders")
	public ResponseEntity<Page<Order>> getOrders(@PathVariable Integer userId,// URL 的路徑中取得參數值
			@RequestParam(defaultValue = "10") @Max(1000) @Min(0) Integer limit,
			@RequestParam(defaultValue = "0") @Min(0) Integer offset) {
		OrderQueryParams orderQueryParams = new OrderQueryParams();
		orderQueryParams.setUserId(userId);
//		orderQueryParams.setLimit(limit);
//		orderQueryParams.setOffset(offset);

		// 取得 order list, Service 的方法來取得訂單列表和訂單總數
		List<Order> orderList = orderService.getOrders(orderQueryParams);

		// 取得 order 總數
		Integer count = orderService.countOrder(orderQueryParams);

		// 分頁
		Page<Order> page = new Page<>();
//		page.setLimit(limit);
//		page.setOffset(offset); 
		page.setTotal(count);
		page.setResult(orderList);

		return ResponseEntity.status(HttpStatus.OK).body(page);
	}

	@GetMapping("/orders")
	public ResponseEntity<Page<Order>> getOrders(@RequestParam(defaultValue = "10") @Max(1000) @Min(0) Integer limit,
			@RequestParam(defaultValue = "0") @Min(0) Integer offset) {
		OrderQueryParams orderQueryParams = new OrderQueryParams();

		// 取得 order list
		List<Order> orderList = orderService.getAllOrders(orderQueryParams);

		// 取得 order 總數
		Integer count = orderService.countOrder(orderQueryParams);

		// 分頁
		Page<Order> page = new Page<>();
		page.setTotal(count);
		page.setResult(orderList);

		return ResponseEntity.status(HttpStatus.OK).body(page);
	}

	@PostMapping("/users/{userId}/orders")
	public ResponseEntity<?> createOrder(@PathVariable Integer userId,
			@RequestBody @Valid CreateOrderRequest createOrderRequest) {
		// createOrder的方法 返回一個orderid 給我們
		Integer orderId = orderService.createOrder(userId, createOrderRequest);

		Order order = orderService.getOrderById(orderId);

		return ResponseEntity.status(HttpStatus.CREATED).body(order);
	}

}
