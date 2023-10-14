package com.example.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.example.model.Employee;

public class EmployeeRowMapper implements RowMapper<Employee>{
	
	@Override
	public Employee mapRow(ResultSet resultSet, int i) throws SQLException {
		Employee employee = new Employee();
		employee.setEmployeeId(resultSet.getInt("employee_id"));
		employee.setEmail(resultSet.getString("email"));
		employee.setPassword(resultSet.getString("password"));
		employee.setJobtitle(resultSet.getString("job_title"));
		
		return employee;
	}
}
