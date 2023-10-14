package com.example.dto;

import javax.validation.constraints.NotNull;

import com.example.constant.ProductCategory;

import lombok.Data;

@Data
public class ProductRequest {
	
//	private Integer productId; //sql 生成的 不需要前端傳回來 以下都需要前端傳回來所以需要保留
	
	@NotNull
	private String productName;

	//private ProductCategory category;
	private  Integer categoryId;
	private  Integer categoryName;
	@NotNull
	private String imageUrl;
	@NotNull
	private Integer price;
	@NotNull
	private Integer stock;
    private String status; 
	private String description;
//	private Timestamp createdDate;//程式碼自動設定不需要傳回來
//	private Timestamp lastModifiedDate;

}
