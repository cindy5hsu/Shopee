package com.example.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import com.example.model.Category;
import org.springframework.jdbc.core.RowMapper;

public class CategoryRowMapper implements RowMapper<Category>  {
	@Override
    public Category mapRow(ResultSet rs, int rowNum) throws SQLException {
        Category category = new Category();
        category.setCategoryId(rs.getInt("category_id"));
        category.setCategoryName(rs.getString("category_name"));
        return category;
    }
}
