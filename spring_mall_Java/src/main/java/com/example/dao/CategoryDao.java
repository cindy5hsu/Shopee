package com.example.dao;

import java.util.List;

import com.example.dto.CategoryRequest;
import com.example.model.Category;

public interface CategoryDao {
	List<Category> getAllCategories();

	Category getCategoryById(Integer categoryId);

	Integer createCategory(CategoryRequest categoryRequest);

	void deleteCategoryById(Integer categoryId);
}
