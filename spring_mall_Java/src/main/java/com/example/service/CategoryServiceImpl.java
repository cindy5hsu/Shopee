package com.example.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.dao.CategoryDao;
import com.example.dto.CategoryRequest;
import com.example.model.Category;

@Component
public class CategoryServiceImpl implements CategoryService {
	@Autowired
    private  CategoryDao categoryDao;
//
//    public CategoryServiceImpl(CategoryDao categoryDao) {
//        this.categoryDao = categoryDao;
//    }
//
    @Override
    public List<Category> getAllCategories() {
        return categoryDao.getAllCategories();
    }

    @Override
    public Category getCategoryById(Integer categoryId) {
        return categoryDao.getCategoryById(categoryId);
    }

    @Override
    public Integer createCategory(CategoryRequest categoryRequest) {
        return categoryDao.createCategory(categoryRequest);
    }
//
//    @Override
//    public void updateCategory(Integer categoryId, Category category) {
//        categoryDao.updateCategory(categoryId, category.getCategoryName());
//    }
//
    @Override
    public void deleteCategoryById(Integer categoryId) {
        categoryDao.deleteCategoryById(categoryId);
    }
}
