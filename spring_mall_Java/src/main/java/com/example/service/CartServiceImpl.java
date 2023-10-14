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

import com.example.dao.CartDao;
import com.example.dao.ProductDao;
import com.example.dao.UserDao;
import com.example.dto.BuyItem;
import com.example.dto.CartQueryParams;
import com.example.dto.CreateCartRequest;
import com.example.model.Cart;
import com.example.model.CartItem;
import com.example.model.Product;
import com.example.model.User;

@Component
public class CartServiceImpl implements CartService {
	private final static Logger log = LoggerFactory.getLogger(CartServiceImpl.class);

	// 使用 autowired 把Dao-Ben 注入進來
	@Autowired
	private CartDao cartDao;

	@Autowired
	private ProductDao productDao;

	@Autowired
	private UserDao userDao;

	@Override
	public Integer countCart(CartQueryParams cartQueryParams) {
		return cartDao.countCart(cartQueryParams);
	}


	@Override
	public List<Cart> getCarts(CartQueryParams cartQueryParams) {
		List<Cart> cartList = cartDao.getCarts(cartQueryParams);
				
		for(Cart cart : cartList) {
			//order 取得 orderitem 根據 orderItemlist 放入每一個底下
			List<CartItem> cartItemList = cartDao.getCartItemsByCartId(cart.getCartId());
			
			cart.setCartItemList(cartItemList);
		}
		return cartList;
	}


	@Override
	public Cart getCartById(Integer cartId) {
		Cart cart = cartDao.getCartById(cartId);
		
		List<CartItem> cartItemList = cartDao.getCartItemsByCartId(cartId);
		
		cart.setCartItemList(cartItemList);
		
		return cart; 
	}


	@Transactional
	@Override
	public Integer createCart(Integer userId, CreateCartRequest createCartRequest) {
		
		User user = userDao.getUserById(userId);
		
		if(user == null) {
			log.warn("該 userId {} 不存在", userId);
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
		
		int totalAmount = 0;
		List<CartItem> cartItemList = new ArrayList<>();
		//forloot 前端傳過來的 getBuyItemList ，forloot 使用者的商品
		for(BuyItem buyItem : createCartRequest.getBuyItemList()) {
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
//			productDao.updateStock(product.getProductId(), product.getStock() - buyItem.getQuantity());
			
			//計算總價錢
			int amount = buyItem.getQuantity() * product.getPrice();
			totalAmount = totalAmount + amount;
			
			//轉換buyItem to cartItem
			CartItem cartItem = new CartItem();
			cartItem.setProductId(buyItem.getProductId());
			cartItem.setQuantity(buyItem.getQuantity());
			cartItem.setAmount(amount);
			
			cartItemList.add(cartItem);
		}
		
		
		Integer cartId = cartDao.createCart(userId, totalAmount);
		
		cartDao.createCartItems(cartId, cartItemList);
		
		return cartId;
	}

	
}
