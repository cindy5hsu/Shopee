package com.example.dao;

import com.example.dto.EmployeeRegisterRequest;
import com.example.model.Employee;

public interface EmployeeDao {
	
	Employee getEmployeeById(Integer employeeId);
	
	Employee getEmployeeByEmail(String email);
	
	
	Integer createEmployee(EmployeeRegisterRequest employeeRegisterRequest);

}
