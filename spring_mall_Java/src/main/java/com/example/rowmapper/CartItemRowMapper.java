package com.example.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.example.constant.ProductCategory;
import com.example.model.CartItem;

public class CartItemRowMapper implements RowMapper<CartItem>{
	@Override
	public CartItem mapRow(ResultSet resultSet, int i) throws SQLException{
		
		CartItem cartItem = new CartItem();
		cartItem.setCartItemId(resultSet.getInt("cart_item_id")); 
		cartItem.setCartId(resultSet.getInt("cart_id")); 
		cartItem.setProductId(resultSet.getInt("product_id"));
		cartItem.setQuantity(resultSet.getInt("quantity"));
		cartItem.setPrice(resultSet.getInt("price"));
		//cartItem.setCategoryId(resultSet.getInt("category_id"));
		
		//String categoryStr = resultSet.getString("category");
//		ProductCategory category = ProductCategory.valueOf(categoryStr);
	//	cartItem.setCategory(categoryStr);


		cartItem.setAmount(resultSet.getInt("amount")); 
		cartItem.setProductName(resultSet.getString("product_name")); 
		cartItem.setImageUrl(resultSet.getString("image_url"));

		return cartItem;

	}

}
