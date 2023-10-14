package com.example.util;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class Page<T> {
	
	private test.User User1;
	private test1.User User2;
	
	
	private Integer limit;
	private Integer offset;
	private Integer total;
	private List<T> result;
	
	
}
