package com.example.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

import com.example.dto.ProductRequest;
import com.example.model.Product;
import com.example.rowmapper.ProductRowMapper;

@Component
public class ProductDaoImpl implements ProductDao{
	@Autowired
	private NamedParameterJdbcTemplate namepjt;
	
	@Override
	public Integer countProduct(ProductQueryParams productQueryParams) {
		String sql = "SELECT count(0) FROM product WHERE 1=1";
	Map<String, Object> map = new HashMap<>();
		
		//查詢條件
	    sql = addFilteringSql(sql, map, productQueryParams);
	
		Integer total = namepjt.queryForObject(sql, map, Integer.class);
		
		return total;
	}

	@Override
	public List<Product> getProducts(ProductQueryParams productQueryParams) {
		
		// 把table 中的商品數據給查詢出來
//		String sql = "SELECT product_id, product_name, category, image_url, price, stock, description,"
//				+ " created_date, last_modified_date"
//				+ " FROM product WHERE 1=1 ";
//		
//		Map<String, Object> map = new HashMap<>();
//		
//		//查詢條件
//		sql = addFilteringSql(sql, map, productQueryParams);
//		
//		//更具 orderby 的欄位，去進行升或者降的排序，因爲在controller裏面加上了defaultValue所以ProductQueryParams不可能是null
//		//所以不需要特別判斷
//		//排序
//		sql = sql + " ORDER BY " + productQueryParams.getOrderBy() + " " + productQueryParams.getSort();
//		//分頁
////		sql = sql + " LIMIT :limit OFFSET :offset";
////		map.put("limit", productQueryParams.getLimit());
////		map.put("offset", productQueryParams.getOffset());
//		
//		//namepjt.query 把商品數據查詢出來，用到查單個商品的 ProductRowMapper
//		//執行完sql取得到 productList 時
//		List<Product> productList = namepjt.query(sql, map, new ProductRowMapper());
//		
//		return productList;
		
		
//		String sql = "SELECT product_id, product_name, category, image_url, price, stock, description,"
//	            + " created_date, last_modified_date"
//	            + " FROM product WHERE 1=1 AND status = 'ON_SHELF'"; // 这里添加了一个新条件
		
//		String sql = "SELECT p.product_id, p.product_name, c.category_name AS category, p.image_url, p.price, p.stock, p.description,"
//		           + "p.created_date, p.last_modified_date, p.status"
//		           + " FROM product p"
//		           + " INNER JOIN category c ON p.category_id = c.category_id"
//		           + " WHERE 1=1 AND p.status = 'ON_SHELF'";
		

		String sql = "SELECT p.product_id, p.product_name, c.category_id, c.category_name, p.image_url, p.price, p.stock, p.description, "
		           + "p.created_date, p.last_modified_date, p.status "
		           + "FROM product p "
		           + "INNER JOIN category c ON p.category_id = c.category_id "
		           + "WHERE p.status = 'ON_SHELF'";
		
	    Map<String, Object> map = new HashMap<>();

	    sql = addFilteringSql(sql, map, productQueryParams);
	    sql = sql + " ORDER BY " + productQueryParams.getOrderBy() + " " + productQueryParams.getSort();
	    List<Product> productList = namepjt.query(sql, map, new ProductRowMapper());
	    
	    return productList;
	}

	@Override
	public Product getProductById(Integer productId) {
//		String sql = "SELECT product_id, product_name, category, image_url, price, stock, description,"
//				+ " created_date, last_modified_date"
//				+ " FROM product WHERE product_id = :productId ";
//		
//		Map<String, Object> map = new HashMap<>();
//		map.put("productId", productId);
//		
//		//查商品數據出來
//		List<Product> productList = namepjt.query(sql, map,new ProductRowMapper());
//		
//		if(productList.size()>0) {
//			return productList.get(0);
//		}else {
//			return null;
//		}
		
//		 String sql = "SELECT product_id, product_name, category, image_url, price, stock, description,"
//		            + " created_date, last_modified_date"
//		            + " FROM product WHERE product_id = :productId AND status = 'ON_SHELF'"; // 这里添加了一个新条件
		
//		String sql = "SELECT p.product_id, p.product_name, c.category_name, p.image_url, p.price, p.stock, p.description, "
//		           + "p.created_date, p.last_modified_date, p.status "
//		           + "FROM product p "
//		           + "INNER JOIN category c ON p.category_id = c.category_id "
//		           + "WHERE p.product_id = :productId AND p.status = 'ON_SHELF'";
		
		String sql = "SELECT p.product_id, p.product_name, c.category_id, c.category_name, p.image_url, p.price, p.stock, p.description, "
		           + "p.created_date, p.last_modified_date, p.status "
		           + "FROM product p "
		           + "INNER JOIN category c ON p.category_id = c.category_id "
		           + "WHERE p.product_id = :productId AND p.status = 'ON_SHELF'";


		    Map<String, Object> map = new HashMap<>();
		    map.put("productId", productId);
		    List<Product> productList = namepjt.query(sql, map, new ProductRowMapper());

		    if (productList.size() > 0) {
		        return productList.get(0);
		    } else {
		        return null;
		    }
	}

	@Override
	public Integer createProduct(ProductRequest productRequest) {
//		String sql = "INSERT INTO product(product_name, category, image_url, price, stock, description,"
//				+ " created_date, last_modified_date)"
//				+ " VALUES(:productName, :category, :imageUrl, :price, :stock, :description, "
//				+ " :createdDate, :lastModifiedDate)";
		//更新可以用版
//		 String sql = "INSERT INTO product(product_name, category, image_url, price, stock, description,"
//		            + " created_date, last_modified_date, status)" // 添加status字段
//		            + " VALUES(:productName, :category, :imageUrl, :price, :stock, :description, "
//		            + " :createdDate, :lastModifiedDate, :status)"; // 添加status参数
		 
		 String sql = "INSERT INTO product(product_name, category_id, image_url, price, stock, description,"
		            + " created_date, last_modified_date, status)" // 添加status字段
		            + " VALUES(:productName, :categoryId, :imageUrl, :price, :stock, :description, "
		            + " :createdDate, :lastModifiedDate, :status)"; // 添加status参数
		
		Map<String, Object> map = new HashMap<>();
		map.put("productName", productRequest.getProductName());
		//map.put("category", productRequest.getCategory().toString());
		map.put("categoryId", productRequest.getCategoryId());
		map.put("imageUrl", productRequest.getImageUrl());
		map.put("price", productRequest.getPrice());
		map.put("stock", productRequest.getStock());
		map.put("description", productRequest.getDescription());
//		map.put("status", ProductStatus.OFF_SHELF.getStatus()); // 默认为OFF_SHELF
		map.put("status", productRequest.getStatus()); 


		
		Date now = new Date();
		map.put("createdDate", now);
		map.put("lastModifiedDate", now);
		
		KeyHolder keyHolder = new GeneratedKeyHolder();
		
		namepjt.update(sql, new MapSqlParameterSource(map), keyHolder);
		
		int productId = keyHolder.getKey().intValue();
		
		return productId;
	}

	@Override
	public void updateProduct(Integer productId, ProductRequest productRequest) {
//		String sql = "UPDATE product SET product_name = :productName, category = :category, image_url = :imageUrl, price= :price, stock= :stock,"
//				+ " description= :description, last_modified_date = :lastModifiedDate, status = :status"
//				+ " WHERE product_id = :productId";
		String sql = "UPDATE product SET product_name = :productName, category_id= :categoryId, image_url = :imageUrl, price= :price, stock= :stock,"
				+ " description= :description, last_modified_date = :lastModifiedDate, status = :status"
				+ " WHERE product_id = :productId";
		
		
		
		   
		Map<String, Object> map = new HashMap<>();    
		map.put("status", productRequest.getStatus()); 
		map.put("productId",  productId);
		
		map.put("productName", productRequest.getProductName());
		//map.put("category", productRequest.getCategory().toString());
		map.put("categoryId", productRequest.getCategoryId());

		map.put("imageUrl", productRequest.getImageUrl());
		map.put("price", productRequest.getPrice());
		map.put("stock", productRequest.getStock());
		map.put("description", productRequest.getDescription());
		
		//記錄當時修改的時間，加到map裏面
		map.put("lastModifiedDate", new Date());
		namepjt.update(sql, map);
	}
	
	

	@Override
	public void updateStock(Integer productId, Integer stock) {
		String sql = "UPDATE product SET stock = :stock, last_modified_date = :lastModifiedDate"
				+ " WHERE product_id = :productId";
		
        Map<String, Object> map = new HashMap<>();    
		
		map.put("productId",  productId);
		
		map.put("stock", stock);
		map.put("lastModifiedDate", new Date());
		
		namepjt.update(sql, map);
	}

	@Override
	public void deleteProductById(Integer productId) {
		String sql = "DELETE FROM product WHERE product_id = :productId";
		
		Map<String, Object>map = new HashMap<>();
		map.put("productId", productId);
		namepjt.update(sql, map);
		
	}
	 private String addFilteringSql(String sql, Map<String, Object>map, ProductQueryParams productQueryParams) {
		//查詢條件
			if(productQueryParams.getCategory() != null) {
				sql = sql + " AND category = :category";
				//因爲category參數是enum 類型，在使用上使用上name的方法
				//enum 類型轉換成字串，才把字串的值加到 map 裏面
				map.put("category", productQueryParams.getCategory().name());
			}
			
			if(productQueryParams.getSearch() != null) {
				sql = sql + " AND product_name LIKE :search";
				//前端傳回來的 map 值前後加% 然後拼接到 map 裏面，search=變數，%%一定要寫在map 裏面
				map.put("search", "%" + productQueryParams.getSearch() + "%");
			}
			return sql;
	 }

}
