package com.example.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.EmployeeLoginRequest;
import com.example.dto.EmployeeRegisterRequest;
import com.example.model.Employee;
import com.example.service.EmployeeService;


@RestController
@CrossOrigin(origins = "*")// allow request from any different url (port)

public class EmployeeConroller {
	
	@Autowired
	private EmployeeService employeeService;
	
	@PostMapping("/employee/register")
	public ResponseEntity<Employee> register(@RequestBody @Valid EmployeeRegisterRequest employeeRegisterRequest){
		if(!employeeRegisterRequest.getPassword().equals(employeeRegisterRequest.getConfirmPassword())) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // 返回400错误
		}
		
		Integer employeeId = employeeService.register(employeeRegisterRequest);
		
		Employee employee = employeeService.getEmployeeById(employeeId);
		return ResponseEntity.status(HttpStatus.CREATED).body(employee);
		
	}
	
	
	@PostMapping("/employee/login")
	//@RequestBody接住前端所傳過來的參數，@Valid 驗證post請求requestbody 的參數
	public ResponseEntity<Employee> login(@RequestBody @Valid  EmployeeLoginRequest employeeLoginRequest) {
		//使用者login的密碼，是否能夠登入，login方法會回傳user類型的返回值回來
		Employee employee  = employeeService.login(employeeLoginRequest);
		
		return ResponseEntity.status(HttpStatus.OK).body(employee);
	}
	
//	@PutMapping("/employee/{employeeId}")
//	public ReponseEntity<Employee> updateProduct(){
//		
//	}
}
