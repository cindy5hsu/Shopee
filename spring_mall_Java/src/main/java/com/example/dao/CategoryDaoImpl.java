package com.example.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import com.example.dto.CategoryRequest;
import com.example.model.Category;
import com.example.rowmapper.CategoryRowMapper;

@Component
public class CategoryDaoImpl implements CategoryDao {
	@Autowired
	private NamedParameterJdbcTemplate namepjt;

	@Override
	public List<Category> getAllCategories() {
		String sql = "SELECT * FROM category";
		Map<String, Object> map = new HashMap<>();
		List<Category> categoryList = namepjt.query(sql, map, new CategoryRowMapper());

		return categoryList;
	}

	@Override
	public Category getCategoryById(Integer categoryId) {
		String sql = "SELECT * FROM category WHERE category_id = :categoryId";
		Map<String, Object> map = new HashMap<>();
		map.put("categoryId", categoryId);

		List<Category> categoryList = namepjt.query(sql, map, new CategoryRowMapper());

		if (categoryList.size() > 0) {
			return categoryList.get(0);
		} else {
			return null;
		}
	}

	@Override
	public Integer createCategory(CategoryRequest categoryRequest) {
		String sql = "INSERT INTO category (category_name) VALUES (:categoryName)";
		Map<String, Object> map = new HashMap<>();
		map.put("categoryName", categoryRequest.getCategoryName());

		KeyHolder keyHolder = new GeneratedKeyHolder();

		namepjt.update(sql, new MapSqlParameterSource(map), keyHolder);

		int categoryId = keyHolder.getKey().intValue();

		return categoryId;
	}

	@Override
	public void deleteCategoryById(Integer categoryId) {
		String sql = "DELETE FROM category WHERE category_id = :categoryId";
		Map<String, Object> map = new HashMap<>();
		map.put("categoryId", categoryId);
		namepjt.update(sql, map);

	}

}
