package com.example.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.dao.OrderDao;
import com.example.dao.ProductDao;
import com.example.dao.UserDao;
import com.example.dto.BuyItem;
import com.example.dto.CreateOrderRequest;
import com.example.dto.OrderQueryParams;
import com.example.model.Order;
import com.example.model.OrderItem;
import com.example.model.Product;
import com.example.model.User;

@Component      
public class OrderServiceImpl implements OrderService{
	
	private final static Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
	
	@Autowired
	private OrderDao orderDao;
	   
	@Autowired
	private ProductDao productDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public Integer countOrder(OrderQueryParams orderQueryParams) {
		return orderDao.countOrder(orderQueryParams);
	}


	@Override
	public List<Order> getOrders(OrderQueryParams orderQueryParams) {
		List<Order> orderList = orderDao.getOrders(orderQueryParams);//更具OQP找出訂單
				
		for(Order order : orderList) {
			//order 取得 orderitem 根據 orderItemlist 放入每一個底下
			List<OrderItem> orderItemList = orderDao.getOrderItemsByOrderId(order.getOrderId());
			
			order.setOrderItemList(orderItemList);
		}
		return orderList;
	}
	


	@Override
	public List<Order> getAllOrders(OrderQueryParams orderQueryParams) {
		List<Order> orderList = orderDao.getOrders(orderQueryParams);//更具OQP找出訂單
		
		for(Order order : orderList) {
			//order 取得 orderitem 根據 orderItemlist 放入每一個底下
			List<OrderItem> orderItemList = orderDao.getOrderItemsByOrderId(order.getOrderId());
			
			order.setOrderItemList(orderItemList);
		}
		return orderList;
	}


	@Override
	public Order getOrderById(Integer orderId) {
		Order order = orderDao.getOrderById(orderId);
		
		List<OrderItem> orderItemList = orderDao.getOrderItemsByOrderId(orderId);
		
		order.setOrderItemList(orderItemList);
		
		return order; 
	}


	@Transactional//會復原資料庫的資料，可以確保 order& orderitem 可以刪除或者新增
	@Override
	public Integer createOrder(Integer userId, CreateOrderRequest createOrderRequest) {
		//檢查 user 是否存在
		User user = userDao.getUserById(userId);
		
		if(user == null) {
			log.warn("該 userId {} 不存在", userId);
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
		
		//計算訂單的總花費資訊
		int totalAmount = 0;
		List<OrderItem> orderItemList = new ArrayList<>();
		//forloot 前端傳過來的 getBuyItemList ，forloot 使用者的商品
		for(BuyItem buyItem : createOrderRequest.getBuyItemList()) {
			//productDao 的getProductById更具前端所傳過來的值，先去資料庫中查詢數據出來
			Product product = productDao.getProductById(buyItem.getProductId());
			
			if(product == null) {
				log.warn("商品 {} 不存在", buyItem.getProductId());
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
			}
			else if (product.getStock() < buyItem.getQuantity()) {
				log.warn("商品 {} 庫存數量不足，無法購買。剩餘庫存 {}，欲購買數量{}",
						buyItem.getProductId(), product.getStock(), buyItem.getQuantity());
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
			}
			
			//扣除商品庫存
			productDao.updateStock(product.getProductId(), product.getStock() - buyItem.getQuantity());
			
			//計算總價錢
			int amount = buyItem.getQuantity() * product.getPrice();
			totalAmount = totalAmount + amount;
			
			//轉換buyItem to orderItem
			OrderItem orderItem = new OrderItem();
			orderItem.setProductId(buyItem.getProductId());
			orderItem.setQuantity(buyItem.getQuantity());
			orderItem.setAmount(amount);
			
			orderItemList.add(orderItem);
		}   
		// 創建訂單
		Integer orderId = orderDao.createOrder(userId, totalAmount);
		//在order item 裏面插入 （）
		orderDao.createOrderItems(orderId, orderItemList);
		
		return orderId;
	}
  
}
