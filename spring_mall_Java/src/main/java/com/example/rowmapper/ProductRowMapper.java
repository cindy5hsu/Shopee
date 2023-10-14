package com.example.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.example.constant.ProductStatus;
import com.example.model.Product;



public class ProductRowMapper implements RowMapper<Product>{

	@Override
	public Product mapRow(ResultSet rs, int rowNum) throws SQLException {
		Product product = new Product();
		
		
		product.setProductId(rs.getInt("product_id"));
		product.setProductName(rs.getString("product_name"));
		product.setCategoryId(rs.getInt("category_id"));
		product.setCategoryName(rs.getString("category_name"));
		product.setStatus(ProductStatus.valueOf(rs.getString("status")));	
		product.setImageUrl(rs.getString("image_url"));
		product.setPrice(rs.getInt("price"));
		product.setStock(rs.getInt("stock"));
		product.setDescription(rs.getString("description"));
		product.setCreatedDate(rs.getTimestamp("created_date"));
		product.setLastModifiedDate(rs.getTimestamp("last_modified_date"));

		return product;
	}

}