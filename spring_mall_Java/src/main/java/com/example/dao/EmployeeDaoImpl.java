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

import com.example.dto.EmployeeRegisterRequest;
import com.example.model.Employee;
import com.example.rowmapper.EmployeeRowMapper;

@Component
public class EmployeeDaoImpl implements EmployeeDao {
	@Autowired
	private NamedParameterJdbcTemplate namepjt;

	@Override
	public Employee getEmployeeById(Integer employeeId) {
		String sql = "SELECT employee_id, email, password, job_title"
				+ " FROM employee WHERE employee_id = :employeeId";

		Map<String, Object> map = new HashMap<>();
		map.put("employeeId", employeeId);
		// 使用 UserRowMapper 將資料庫的結果轉換成爲 List<user>
		List<Employee> employeeList = namepjt.query(sql, map, new EmployeeRowMapper());

		if (employeeList.size() > 0) {
			return employeeList.get(0);
		} else {
			return null;
		}
	}

	@Override
	public Employee getEmployeeByEmail(String email) {
		String sql = "SELECT employee_id, email, password, job_title"
				+ " FROM employee WHERE email = :email";
		
		Map<String, Object> map = new HashMap<>();
		map.put("email", email);
		//使用 UserRowMapper 將資料庫的結果轉換成爲 List<user> 
		List<Employee> employeeList = namepjt.query(sql, map, new EmployeeRowMapper());
		
		if(employeeList.size() > 0) {
			return employeeList.get(0);
		}else {
			return null;
		}
	}

	@Override
	public Integer createEmployee(EmployeeRegisterRequest employeeRegisterRequest) {
		String sql = "INSERT INTO employee(email, password, job_title)" + " VALUES (:email, :password, :jobtitle)";

		Map<String, Object> map = new HashMap<>();
		map.put("email", employeeRegisterRequest.getEmail());
		map.put("password", employeeRegisterRequest.getPassword());
		map.put("jobtitle", employeeRegisterRequest.getJobtitle());

		KeyHolder keyHolder = new GeneratedKeyHolder();

		namepjt.update(sql, new MapSqlParameterSource(map), keyHolder);

		// 可以接住mysql 自動生成的 userId
		int employeeId = keyHolder.getKey().intValue();

		return employeeId;
	}
}
