package com.example.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.CategoryRequest;
import com.example.model.Category;
import com.example.service.CategoryService;

@Validated 
@RestController
@CrossOrigin(origins = "*")
public class CategoryController {

	@Autowired
    private  CategoryService categoryService;

   

    // 查詢所有類別
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categoryList = categoryService.getAllCategories();
        return ResponseEntity.status(HttpStatus.OK).body(categoryList);
    }


   // 創建新類別
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody @Valid CategoryRequest categoryRequest) {
        Integer categoryId = categoryService.createCategory(categoryRequest);
        Category category = categoryService.getCategoryById(categoryId);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }


   // 刪除類別
    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer categoryId) {
        categoryService.deleteCategoryById(categoryId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
