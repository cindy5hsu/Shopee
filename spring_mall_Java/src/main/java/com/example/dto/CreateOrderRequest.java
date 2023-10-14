package com.example.dto;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import lombok.Data;

@Data
public class CreateOrderRequest {
	@NotEmpty
	private List<BuyItem> buyItemList;
	
	public List<BuyItem> buyItemList(){
		return buyItemList;
	}
	
	public void setBuyItemList(List<BuyItem> buyItemList) {
		this.buyItemList = buyItemList;
	}

}
