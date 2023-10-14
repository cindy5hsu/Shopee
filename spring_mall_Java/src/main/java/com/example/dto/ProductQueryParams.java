package com.example.dto;

import com.example.constant.ProductCategory;

import lombok.Data;

@Data
public class ProductQueryParams {
	//private  ProductCategory category;
	private  Integer categoryId;

	private String search;
	private String orderBy;
	private String sort;
//	private Integer limit;
//	private Integer offset;

}
