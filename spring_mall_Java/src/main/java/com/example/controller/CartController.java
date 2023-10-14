package com.example.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.CartQueryParams;
import com.example.dto.CreateCartRequest;
import com.example.model.Cart;
import com.example.service.CartService;
import com.example.util.Page;

@RestController //是用來處理 RESTful API 的請求
@CrossOrigin(origins = "*") 

public class CartController {
	//會自動注入
	@Autowired
	private CartService cartService;

	@GetMapping("/users/{userId}/carts")
	public ResponseEntity<Page<Cart>> getCarts(@PathVariable Integer userId

	) {
		CartQueryParams cartQueryParams = new CartQueryParams();
		cartQueryParams.setUserId(userId);


		// 取得 Cart list
		List<Cart> cartList = cartService.getCarts(cartQueryParams);

		// 取得 Cart 總數
		Integer count = cartService.countCart(cartQueryParams);

		// 分頁
		Page<Cart> page = new Page<>();
		page.setTotal(count);
		page.setResult(cartList);

		return ResponseEntity.status(HttpStatus.OK).body(page);
	}

	@PostMapping("/users/{userId}/carts") // 接著前端傳來的 Json 參數， notnull 要加 vailid
	public ResponseEntity<?> createCart(@PathVariable Integer userId,
			@RequestBody @Valid CreateCartRequest cartRequest) {

		// 方法 參數
		Integer cartId = cartService.createCart(userId, cartRequest);

		Cart cart = cartService.getCartById(cartId);

		return ResponseEntity.status(HttpStatus.CREATED).body(cart);

	}

}
