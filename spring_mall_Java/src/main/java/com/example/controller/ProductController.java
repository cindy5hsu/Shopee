package com.example.controller;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.constant.ProductCategory;
import com.example.dao.ProductQueryParams;
import com.example.dto.ProductRequest;
import com.example.model.Product;
import com.example.service.ProductService;
import com.example.util.Page;

@Validated //加了這兩個 @Min @min 驗證前端傳回來的值之後 需要加@Validated，這樣才會生效
@RestController
@CrossOrigin(origins = "*")
public class ProductController {
	@Autowired
	private ProductService productService;
	
	@GetMapping("/products")
	public ResponseEntity<Page<Product>> getProducts(
			//category 的參數是從URL 中所取得的參數
			//前端可以通過 category 的值去指定說 他想要查看的是哪一個分類的商品
			//category有預先設定好的值 可以通過 ProductCategory這個emun 去當做參數的類型，
			//會把前端傳回來的字串轉成ProductCategory這個emun
			//收到category的值之後，那我們要選擇商品數據，只有分類的商品才能夠查詢出來，返回給前端
			@RequestParam(required = false) ProductCategory category,//查詢條件 Filtering
			//沒有傳遞 category 的值過來的時候 required = false
			@RequestParam(required = false) String search,
			
			//假設前端可以傳遞orderBy參數過來的話，orderBy的值就是預設create_date
			@RequestParam(defaultValue = "created_date") String orderBy,//排序 Sorting
			@RequestParam(defaultValue = "desc") String sort,//desc 從大到小的排序
			
			//分頁 Pagination，取得前5筆數據eg.如果是百萬的話資料庫不好維護
			@RequestParam(defaultValue = "5") @Max(1000) @Min(0) Integer limit,//取得幾筆商品數據
			@RequestParam(defaultValue = "0") @Min(0) Integer offset//跳過多少筆數據
			){
		//將ProductCategory category 前端傳過來的值 被send到productQueryParams裏面
		//前端的(ProductCategory category)值設定好之後，把productQueryParams 的值設定在getProducts裏面
		ProductQueryParams productQueryParams = new ProductQueryParams();
		//減低寫錯參數的一個機率
		productQueryParams.setCategory(category);
		productQueryParams.setSearch(search);
		productQueryParams.setOrderBy(orderBy);
		productQueryParams.setSort(sort);
//		productQueryParams.setLimit(limit);
//		productQueryParams.setOffset(offset);

		
		//在service 使用 getProduct 的方法
		//productList 接住 getProduct 的參數
		//取得productList商品列表的時候，并沒有判斷productList 是否為空的list ,反而是吧productList直接返回給前端，而且狀態碼固定200
		List<Product> productList = productService.getProducts(productQueryParams);
		
		//取得 product 總數
		//根據productQueryParams條件 去計算countProduct
		Integer total = productService.countProduct(productQueryParams);
		
		//分頁
		Page<Product> page = new Page<>();
//		page.setLimit(limit);
//		page.setOffset(offset);//前端傳回來offset的值，在回傳到前端的page
		page.setTotal(total);
		page.setResult(productList);//查詢出來的商品數據，放到 result 的變數裏面回傳給前端
		
		//body(productList) 放在 Responsebody 裏面回傳給前端
		//不管有沒有查詢到商品的數據， 都回傳 200 Ok 的狀態碼
		return ResponseEntity.status(HttpStatus.OK).body(page);
	}
	
	@GetMapping("/products/{productId}")
	public ResponseEntity<Product> getProduct(@PathVariable Integer productId)
	{
		Product product = productService.getProductById(productId);
		
		//商品不是null 的話就會回傳 200 Ok  的狀態給前端
		if(product != null) {
			return ResponseEntity.status(HttpStatus.OK).body(product);
		}
		//商品是null 的話就會回傳 404 NOT_FOUND  的狀態給前端

		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}
	
	@PostMapping("/products")
	public ResponseEntity<Product> createProduct(@RequestBody @Valid ProductRequest productRequest){
	    //ProductStatus status = ProductStatus.valueOf(productRequest.getStatus());

		Integer productId = productService.createProduct(productRequest);
		
		Product product = productService.getProductById(productId);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(product);
	}
	
	@PutMapping("products/{productId}")
	public ResponseEntity<Product> updateProduct(@PathVariable Integer productId,
		@RequestBody @Valid	ProductRequest productRequest){
		//使用productId 嘗試去查詢商品的數據出來，product 是 null 的話 商品不存在就需要回傳404 notfound 的數據出來
		//查詢商品是否存在
		Product product = productService.getProductById(productId);
		
		if(product == null){
	return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}
		
		// 如果存在的話就可以進去修改數據
		productService.updateProduct(productId, productRequest);
		
//		productservice -> getproductbyid 的方法、productId 的值當作參數傳進去，可以從資料庫裏面傳出修改後的數據出來
		Product updatedProduct = productService.getProductById(productId);
		
		//告訴前端說商品更新成功了，修改的數據值是多少
		return ResponseEntity.status(HttpStatus.OK).body(updatedProduct);
		 
	}
	//刪除商品
	@DeleteMapping("/products/{productId}")
	//方法名字 deleteProduct(參數)
	public ResponseEntity<?> deleteProduct(@PathVariable Integer productId){
		//productService 會通過 deleteproductbyId 的方法， 更具productId 刪除數據
		productService.deleteProductById(productId);
		
		//刪除完成之後 將 ResponseEntity 回傳給前端
		//不管有沒有刪除這個商品只有確定不見就會出現 204 Not_content 這個的狀態碼給前端
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
