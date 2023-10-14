package com.example.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.example.model.Cart;

public class CartRowMapper implements RowMapper<Cart>{

	@Override
	public Cart mapRow(ResultSet rs, int i) throws SQLException {
	    Cart cart = new Cart();
	    
	    // 使用實例方法設置 Cart 實例的屬性值
	    cart.setCartId(rs.getInt("cart_id"));
	    cart.setUserId(rs.getInt("user_id"));
	    cart.setTotalAmount(rs.getInt("total_amount"));
	    cart.setCreateDate(rs.getTimestamp("created_date"));
	    cart.setLastModifiedDate(rs.getTimestamp("last_modified_date"));
	    
	    return cart;
	}
}
