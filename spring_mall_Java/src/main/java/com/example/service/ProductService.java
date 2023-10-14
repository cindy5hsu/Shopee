package com.example.service;

import java.util.List;

import com.example.dao.ProductQueryParams;
import com.example.dto.ProductRequest;
import com.example.model.Product;

public interface ProductService {
	
	Integer countProduct(ProductQueryParams productQueryParams);
	//getproduct 的方法
	List<Product> getProducts(ProductQueryParams productQueryParams);
	
	//取德商品數據
	Product getProductById(Integer productId);
	
	Integer createProduct(ProductRequest productRequest);
	
	void updateProduct(Integer productId, ProductRequest productRequest);
	
	void deleteProductById(Integer productId);
}
