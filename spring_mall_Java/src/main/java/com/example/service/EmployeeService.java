package com.example.service;

import com.example.dto.EmployeeLoginRequest;
import com.example.dto.EmployeeRegisterRequest;
import com.example.model.Employee;

public interface EmployeeService {
	Employee getEmployeeById(Integer employeeId);
	
	Integer register(EmployeeRegisterRequest employeeRegisterRequest);

	
	Employee login(EmployeeLoginRequest employeeLoginRequest);

}
