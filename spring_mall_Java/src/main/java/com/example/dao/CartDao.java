package com.example.dao;

import java.util.List;

import com.example.dto.CartQueryParams;
import com.example.model.Cart;
import com.example.model.CartItem;

public interface CartDao {
	Integer countCart(CartQueryParams cartQueryParams);

	List<Cart> getCarts(CartQueryParams cartQueryParams);

	Cart getCartById(Integer cartId);

	List<CartItem> getCartItemsByCartId(Integer cartId);

	Integer createCart(Integer userId, Integer totalAmount);

	void createCartItems(Integer cartId, List<CartItem> cartItemList);
}
