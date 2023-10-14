package com.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;
import org.springframework.web.server.ResponseStatusException;


import com.example.dao.EmployeeDao;
import com.example.dto.EmployeeLoginRequest;
import com.example.dto.EmployeeRegisterRequest;
import com.example.model.Employee;

@Component
public class EmployeeServiceImpl implements EmployeeService{
	
	private final static Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);

	
	@Autowired
	private EmployeeDao employeeDao;


	@Override
	public Employee getEmployeeById(Integer employeeId) {
		return employeeDao.getEmployeeById(employeeId);
	}



	@Override
	public Integer register(EmployeeRegisterRequest employeeRegisterRequest) {
		//檢查注冊的 email,不能重複
		Employee employee = employeeDao.getEmployeeByEmail(employeeRegisterRequest.getEmail());
		
		if (employee != null) {
        	log.warn("該 email {} 已經被注冊", employeeRegisterRequest.getEmail());

			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);          
		}
		//使用 MD5 生成密碼的雜凑值                          將字串轉換成爲 bytes 類型
        String hashPassword = DigestUtils.md5DigestAsHex(employeeRegisterRequest.getPassword().getBytes());
        employeeRegisterRequest.setPassword(hashPassword);
		//創建賬號
		return employeeDao.createEmployee(employeeRegisterRequest);
	}

	@Override
	public Employee login(EmployeeLoginRequest employeeLoginRequest) {
		Employee employee = employeeDao.getEmployeeByEmail(employeeLoginRequest.getEmail());
		
		if(employee == null) {
			log.warn("該 email {} 尚未注冊", employeeLoginRequest.getEmail()  );
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
		//比較密碼
        String hashedPassword = DigestUtils.md5DigestAsHex(employeeLoginRequest.getPassword().getBytes());

		if (employee.getPassword().equals(hashedPassword)) {
			return employee;
		}else {
			log.warn("email {} 的密碼不正確", employeeLoginRequest.getEmail());
			//强制停止前端的請求
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
	}
}
