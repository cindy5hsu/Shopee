package com.example.dao;

import java.util.List;

import com.example.dto.ProductRequest;
import com.example.model.Product;

public interface ProductDao {
	
	Integer countProduct(ProductQueryParams productQueryParams);
	
	List<Product> getProducts(ProductQueryParams productQueryParams);
	
	Product getProductById(Integer productId);
	
	Integer createProduct(ProductRequest productRequest);
	
	void updateProduct(Integer productId, ProductRequest productRequest);
	
	void updateStock(Integer productId, Integer stock);
	
	void deleteProductById(Integer productId);

}
