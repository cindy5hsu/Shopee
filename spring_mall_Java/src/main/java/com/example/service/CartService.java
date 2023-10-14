package com.example.service;

import java.util.List;

import com.example.dto.CartQueryParams;
import com.example.dto.CreateCartRequest;
import com.example.model.Cart;
import com.example.model.Order;

public interface CartService {
//	Cart getCartById(Integer cartId);
	Integer countCart(CartQueryParams cartQueryParams);
	
	List<Cart> getCarts(CartQueryParams cartQueryParams);
	
	Cart getCartById(Integer cartId);
	
	Integer createCart(Integer userId, CreateCartRequest createCartRequest);


}
