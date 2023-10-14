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

import com.example.dto.OrderQueryParams;
import com.example.model.Order;
import com.example.model.OrderItem;
import com.example.rowmapper.OrderItemRowMapper;
import com.example.rowmapper.OrderRowMapper;

@Component //建立Dao bean
public class OrderDaoImpl implements OrderDao {

	@Autowired
	private NamedParameterJdbcTemplate namepjt;//spring 簡化 JDBC

	@Override
	public Integer countOrder(OrderQueryParams orderQueryParams) {
		String sql = "SELECT count(0) FROM `order` o WHERE 1=1";
		 //map，用來儲存 SQL 查詢參數  
		Map<String, Object> map = new HashMap<>();//資料結構，可以讓你存儲和取出物件

		// 查詢條件
		sql = addFilteringSql(sql, map, orderQueryParams);

		Integer total = namepjt.queryForObject(sql, map, Integer.class);
		return total;
	}

	@Override
	public List<Order> getOrders(OrderQueryParams orderQueryParams) {
		String sql = "SELECT o.order_id, o.user_id, o.total_amount, o.created_date, o.last_modified_date, u.email "
				+ "FROM `order` o " + "JOIN `user` u ON o.user_id = u.user_id " + "WHERE 1=1";

		Map<String, Object> map = new HashMap<>();

		// 查詢條件
		sql = addFilteringSql(sql, map, orderQueryParams);

		// 排序-最新訂單在最前面
		sql = sql + " ORDER BY created_date DESC ";

		// 分頁-參數取得幾筆到幾筆
//        sql = sql + " LIMIT :limit OFFSET :offset ";
//        map.put("limit",   orderQueryParams.getLimit());
//        map.put("offset", orderQueryParams.getOffset());

		List<Order> orderList = namepjt.query(sql, map, new OrderRowMapper());
		return orderList;
	}

	@Override
	public List<Order> getAllOrders(OrderQueryParams orderQueryParams) {
		String sql = "SELECT o.order_id, o.user_id, o.total_amount, o.created_date, o.last_modified_date, u.email "
				+ "FROM `order` o " + "JOIN `user` u ON o.user_id = u.user_id " + "WHERE 1=1";

		Map<String, Object> map = new HashMap<>();

		// 查詢條件
		sql = addFilteringSql(sql, map, orderQueryParams);

		// 排序-最新訂單在最前面
		sql = sql + " ORDER BY created_date DESC ";

		List<Order> orderList = namepjt.query(sql, map, new OrderRowMapper());
		return orderList;
	}

	@Override
	public Order getOrderById(Integer orderId) {
		String sql = "SELECT o.order_id, o.user_id, o.total_amount, o.created_date, o.last_modified_date, u.email "
				+ "FROM `order` o " + "JOIN `user` u ON o.user_id = u.user_id " + "WHERE 1=1";
		Map<String, Object> map = new HashMap<>();
		map.put("orderId", orderId);

		List<Order> orderList = namepjt.query(sql, map, new OrderRowMapper());

		if (orderList.size() > 0) {
			return orderList.get(0);
		} else {
			return null;
		}
	}

	@Override
	public List<OrderItem> getOrderItemsByOrderId(Integer orderId) {
		String sql = "SELECT oi.order_item_id, oi.order_id, oi.product_id, oi.quantity, oi.amount, p.product_name, p.image_url"
				+ " FROM order_item as oi" + " LEFT JOIN product as p ON oi.product_id = p.product_id"
				+ " WHERE oi.order_id = :orderId";

		Map<String, Object> map = new HashMap<>();
		map.put("orderId", orderId);
		 //sql 是查詢語句，map 存放的是查詢語句裡面的參數值
		List<OrderItem> orderItemList = namepjt.query(sql, map, new OrderItemRowMapper());
		return orderItemList;
	}

	@Override
	public Integer createOrder(Integer userId, Integer totalAmount) {
		String sql = "INSERT INTO `order`(user_id, total_amount, created_date, last_modified_date)"
				+ " VALUES(:userId, :totalAmount, :createDate, :lastModifiedDate)";

		Map<String, Object> map = new HashMap<>();
		map.put("userId", userId);
		map.put("totalAmount", totalAmount);

		Date now = new Date();
		map.put("createDate", now);
		map.put("lastModifiedDate", now);

		// 創建一個KeyHolder對象，用於保存由數據庫生成的主鍵值
		KeyHolder keyHolder = new GeneratedKeyHolder();

		namepjt.update(sql, new MapSqlParameterSource(map), keyHolder);
		// 從keyHolder中獲取由數據庫生成的主鍵值，並將其轉換為int類型
		int orderId = keyHolder.getKey().intValue();

		return orderId;
	}

	@Override
	public void createOrderItems(Integer orderId, List<OrderItem> orderItemList) {
		String sql = "INSERT INTO order_item(order_id, product_id, quantity, amount)"
				+ " VALUES(:orderId, :productId, :quantity, :amount)";
		
		// 創建一個  陣列來儲存 SQL 查詢的參數
		MapSqlParameterSource[] parameterSources = new MapSqlParameterSource[orderItemList.size()];

		for (int i = 0; i < orderItemList.size(); i++) {
			OrderItem orderItem = orderItemList.get(i);

		    // 為當前的orderItem創建一個新的MapSqlParameterSource對象來儲存參數
			parameterSources[i] = new MapSqlParameterSource();
		    // 添加orderId參數到MapSqlParameterSource對象
			parameterSources[i].addValue("orderId", orderId);
			parameterSources[i].addValue("productId", orderItem.getProductId());
			parameterSources[i].addValue("quantity", orderItem.getQuantity());
			parameterSources[i].addValue("amount", orderItem.getAmount());

		}
		// 呼叫batchUpdate方法來執行批量更新操作
		namepjt.batchUpdate(sql, parameterSources);
	}
                                               //map，用來儲存 SQL 查詢參數    參數和值            查詢數據
	private String addFilteringSql(String sql, Map<String, Object> map, OrderQueryParams orderQueryParams) {
		if (orderQueryParams.getUserId() != null) {
			sql = sql + " AND o.user_id = :userId";

			map.put("userId", orderQueryParams.getUserId());
		}
		return sql;
	}
}
