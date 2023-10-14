package com.example.service;

import java.util.List;

import com.example.dto.CategoryRequest;
import com.example.model.Category;

public interface CategoryService {
	 List<Category> getAllCategories();
	    Category getCategoryById(Integer categoryId);
	    Integer createCategory(CategoryRequest categoryRequest);
//	    void updateCategory(Integer categoryId, String categoryName);
	    void deleteCategoryById(Integer categoryId);
}
