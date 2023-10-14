package com.example.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.dao.ProductDao;
import com.example.dao.ProductQueryParams;
import com.example.dto.ProductRequest;
import com.example.model.Product;

@Component
public class ProductserviceImpl implements ProductService{
	
	@Autowired
	private ProductDao productDao;
	
	@Override
	public Integer countProduct(ProductQueryParams productQueryParams) {
		return productDao.countProduct(productQueryParams);
	}


	@Override
	public List<Product> getProducts(ProductQueryParams productQueryParams) {
		return productDao.getProducts(productQueryParams);
	}


	@Override
	public Product getProductById(Integer productId) {
		return productDao.getProductById(productId);
	}


	@Override
	public Integer createProduct(ProductRequest productRequest) {
		//ProductStatus status = ProductStatus.valueOf(productRequest.getStatus()); // 从请求体中获取新的状态

		return productDao.createProduct(productRequest);
	}


	@Override
	public void updateProduct(Integer productId, ProductRequest productRequest) {
		productDao.updateProduct(productId, productRequest);
		
	}


	@Override
	public void deleteProductById(Integer productId) {
		productDao.deleteProductById(productId);
		
	}
	
	

}
