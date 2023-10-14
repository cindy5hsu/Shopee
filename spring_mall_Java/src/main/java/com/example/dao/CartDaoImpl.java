package com.example.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import com.example.dto.CartQueryParams;
import com.example.model.Cart;
import com.example.model.CartItem;
import com.example.rowmapper.CartItemRowMapper;
import com.example.rowmapper.CartRowMapper;

@Component //建立Dao bean
public class CartDaoImpl implements CartDao {

	@Autowired
	private NamedParameterJdbcTemplate namepjt;//spring 簡化 JDBC

	@Override
	public Integer countCart(CartQueryParams cartQueryParams) {
		String sql = "SELECT count(0) FROM `cart` WHERE 1=1";
		 //map，用來儲存 SQL 查詢參數 
        Map<String, Object> map = new HashMap<>();//Has 儲和取出物件
        
        //查詢條件
        sql =  addFilteringSql(sql, map, cartQueryParams);
        
        Integer total = namepjt.queryForObject(sql, map, Integer.class);
		return total;
	}

	@Override
	public List<Cart> getCarts(CartQueryParams cartQueryParams) {
		String sql = "SELECT cart_id, user_id, total_amount, created_date, last_modified_date FROM `cart` WHERE 1=1";
		
		Map<String, Object> map = new HashMap<>();
		
		 //查詢條件
        sql = addFilteringSql(sql, map, cartQueryParams);
        
        //排序-最新訂單在最前面
        sql = sql + " ORDER BY created_date DESC ";


        List<Cart> cartList = namepjt.query(sql, map, new CartRowMapper());
		return cartList;
	}
	
	@Override
	public Cart getCartById(Integer cartId) {
		String sql = "SELECT cart_id, user_id, total_amount, created_date, last_modified_date "
				+ " FROM `cart` WHERE cart_id = :cartId";

		Map<String, Object> map = new HashMap<>();
		map.put("cartId", cartId);

		List<Cart> cartList = namepjt.query(sql, map, new CartRowMapper());

		if (cartList.size() > 0) {
			return cartList.get(0);
		} else {
			return null;
		}
	}
	
	@Override
	public List<CartItem> getCartItemsByCartId(Integer cartId) {
		String sql = "SELECT ci.cart_item_id, ci.cart_id, ci.product_id, ci.quantity, ci.amount, p.product_name, p.image_url, p.price, p.stock"
				+ " FROM cart_item as ci"
				+ " LEFT JOIN product as p ON ci.product_id = p.product_id"
				+ " WHERE ci.cart_id = :cartId";
		
		Map<String, Object> map = new HashMap<>();
		map.put("cartId", cartId);
		
		List<CartItem> cartItemList = namepjt.query(sql, map, new CartItemRowMapper());
		return cartItemList;
	}

	@Override
	public Integer createCart(Integer userId, Integer totalAmount) {

		String sql = "INSERT INTO `cart`(user_id, total_amount, created_date, last_modified_date)"
				+ " VALUES(:userId, :totalAmount, :createDate, :lastModifiedDate)";
		
		
		Map<String, Object> map = new HashMap<>();
		map.put("userId", userId);
		map.put("totalAmount", totalAmount);
		
		Date now = new Date();
		map.put("createDate", now);
		map.put("lastModifiedDate", now);
		
		//保存id自動產生
		KeyHolder keyHolder = new GeneratedKeyHolder();
		
		namepjt.update(sql, new MapSqlParameterSource(map), keyHolder);
		
		int cartId = keyHolder.getKey().intValue();
		
		return cartId;
	}


	@Override
	public void createCartItems(Integer cartId, List<CartItem> cartItemList) {
		String sql = "INSERT INTO cart_item(cart_id, product_id, quantity, amount)"
				+ " VALUES(:cartId, :productId, :quantity, :amount)";
		
		MapSqlParameterSource[] parameterSources  = new MapSqlParameterSource[cartItemList.size()];
		
		for(int i = 0; i< cartItemList.size(); i++) {
			CartItem cartItem = cartItemList.get(i);
			
		    // 為當前的orderItem創建一個新的MapSqlParameterSource對象來儲存參數
			parameterSources[i] = new MapSqlParameterSource();
			parameterSources[i].addValue("cartId", cartId);
			parameterSources[i].addValue("productId", cartItem.getProductId());
			parameterSources[i].addValue("quantity", cartItem.getQuantity());
			parameterSources[i].addValue("amount", cartItem.getAmount());

		}
		namepjt.batchUpdate(sql, parameterSources);
	}
	
	
	private String addFilteringSql(String sql, Map<String, Object> map, CartQueryParams cartQueryParams) {
		if(cartQueryParams.getUserId() != null) {
			sql = sql + " AND user_id = :userId"; //如果不是null 就会在 sql 后面并且在后面放上urerid
			map.put("userId", cartQueryParams.getUserId());
		}
		return sql;
	}

	
}
