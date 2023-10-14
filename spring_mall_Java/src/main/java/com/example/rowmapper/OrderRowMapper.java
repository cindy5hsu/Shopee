package com.example.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.example.model.Order;

public class OrderRowMapper implements RowMapper<Order> {

	@Override
	public Order mapRow(ResultSet resultSet, int i) throws SQLException {
		Order order = new Order();
		order.setOrderId(resultSet.getInt("order_id"));
		order.setUserId(resultSet.getInt("user_id"));
		order.setEmail(resultSet.getString("email"));
		order.setTotalAmount(resultSet.getInt("total_amount"));
		order.setCreateDate(resultSet.getTimestamp("created_date"));
		order.setLastModifiedDate(resultSet.getTimestamp("last_modified_date"));
		return order;
	}

}
