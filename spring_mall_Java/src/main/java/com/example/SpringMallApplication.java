package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan(basePackages = {
		"com.example"
})
@SpringBootApplication
public class SpringMallApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringMallApplication.class, args);
	}

}
