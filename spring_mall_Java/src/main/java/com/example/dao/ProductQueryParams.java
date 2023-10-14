package com.example.dao;

import com.example.constant.ProductCategory;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ProductQueryParams {
	private  ProductCategory category;
	private String search;
	private String orderBy;
	private String sort;
//	private Integer limit;
//	private Integer offset;

}
