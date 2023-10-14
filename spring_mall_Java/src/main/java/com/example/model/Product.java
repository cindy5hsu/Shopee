package com.example.model;

import java.sql.Timestamp;

import com.example.constant.ProductCategory;
import com.example.constant.ProductStatus;

import lombok.Data;
@Data
public class Product {
	private Integer productId;
	private String productName;
	//private ProductCategory category;
	private Integer categoryId;
    private String categoryName;

	private String imageUrl;
	private Integer price;
	private Integer stock;
	private String description;
	private Timestamp createdDate;
	private Timestamp lastModifiedDate;
	private ProductStatus status;
}
