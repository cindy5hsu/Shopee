package com.example.constant;

public enum ProductStatus {
	ON_SHELF("ON_SHELF"), // 上架
    OFF_SHELF("OFF_SHELF"); // 下架

    private String status;

    ProductStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

}
