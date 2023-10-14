import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Table,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { Link } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import TablePagination from "@mui/material/TablePagination";
import EditIcon from "@mui/icons-material/Edit";
import Grid from '@mui/material/Grid';
import DeleteIcon from "@mui/icons-material/Delete";



interface Product {
  id: string; 
  productId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  price: number;
  stock: number;
  description: string | null;
  createdDate: string;
  lastModifiedDate: string;
  status: "上架" | "下架";
}

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState(0); // for pagination
  const [rowsPerPage, setRowsPerPage] = useState(6); // for pagination
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

 


  const handleSave = () => {
    if (editingProduct) {
      // 创建一个新的物件，只包括后端需要的字段
      const updatedProduct = {
        productName: editingProduct.productName,
        categoryId: editingProduct.categoryId,
        imageUrl: editingProduct.imageUrl,
        price: editingProduct.price,
        stock: editingProduct.stock,
        status: editingProduct.status, 
      };
  
      // 使用 updatedProduct 发送PUT请求到后端更新产品信息
      axios.put(`http://localhost:8080/products/${editingProduct.productId}`, updatedProduct)
        .then((response) => {
          // 在此处更新前端的产品列表
          setProducts(products.map(product =>
            product.productId === editingProduct!.productId ? { ...editingProduct } : product
          ));
          setEditingProduct(null); // 清除正在编辑的产品
        })
        .catch((error) => {
          console.error("更新产品信息时出错", error);
        });
    }
  };
  
  

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/products`)
      .then((response) => {
        console.log("Response data:", response.data);
        setProducts(response.data.result); //渲染到畫面中
        //setFilteredMembers(response.data); // 将数据设置为过滤后的成员
      })
      .catch((error) => {
        console.error("There was an error fetching data", error);
      });
  }, []);

  const handleDelete = (productId: number) => { // 接受productId参数
    console.log(productId);
    axios.delete(`http://localhost:8080/products/${productId}`, {
  headers: {
    'Content-Type': 'application/json',
  },
})
.then((response) => {
  if (response.status === 204) {
    console.log('產品删除成功');
    // 更新产品列表
    setProducts(products.filter(product => product.productId !== productId));
    
  } else {
    console.error('產品删除失败');
  }
})
.catch((error) => {
  console.error('请求错误:', error);
});

  }; 


  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 6));
    setPage(0);
  };

  const displayProducts = filteredProducts.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <div style={{ padding: "2em" }}>
      <Typography variant="h4" gutterBottom>
      商品管理
      </Typography>

      <Autocomplete
        options={filteredProducts}
        getOptionLabel={(option: Product) => option.productName}
        onInputChange={(event, newInputValue) => {
          setSearchTerm(newInputValue);
        }}
        renderInput={(params) => <TextField {...params} label="搜索商品" />}
      />

      <Link to="/AddPro">
        <Button
          startIcon={<AddShoppingCartIcon style={{ color: "white" }} />}
          style={{
            backgroundColor: "#e24c0e",
            color: "white",
            margin: "16px",
          }}
        >
          新增加商品
        </Button>
      </Link>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>商品序號</TableCell>
            <TableCell>商品名稱</TableCell>
            <TableCell>價格</TableCell>
            <TableCell>商品描述</TableCell>
            <TableCell>圖片</TableCell>
            <TableCell>創建日期</TableCell>
            <TableCell>類別</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayProducts.map((product, index) => (
            <TableRow
            key={product.productId} 
             style={{
                backgroundColor:
                  index % 2 === 0 ? "rgba(0, 0, 0, 0.04)" : undefined, // 这里设置您喜欢的颜色
              }}
            >
              <TableCell>{product.productId}</TableCell>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                {product.description
                  ? product.description.substring(0, 10)
                  : "N/A"}
              </TableCell>
              <TableCell>{product.imageUrl.substring(0, 10)}</TableCell>
              <TableCell>{product.createdDate}</TableCell>
              <TableCell>{product.categoryName}</TableCell>

              <TableCell>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(product)}
                  style={{ color: "#1565c0" }}
                  >
                  修改
                </Button>

                <Button
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(product.productId)} // 传递productId
                style={{ color: "#e57373" }}
              >
                删除
              </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        
        {editingProduct && (
          <Dialog
          open={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          fullWidth={true}
          maxWidth="lg"
        >
          <form style={{ overflow: 'auto', padding: '20px' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="商品名稱"
                  variant="outlined"
                  value={editingProduct.productName}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      productName: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="價格"
                  variant="outlined"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: Number(e.target.value),
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="商品描述"
                  variant="outlined"
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="庫存"
                  variant="outlined"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stock: Number(e.target.value),
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="圖片鏈接"
                  variant="outlined"
                  value={editingProduct.imageUrl}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      imageUrl: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="商品類別"
                  variant="outlined"
                  value={editingProduct.categoryId}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      categoryId: Number(e.target.value),
                    })
                  }
                />
              </Grid>
              
            </Grid>
            <Button
              variant="contained"
              onClick={handleSave}
              style={{ backgroundColor: "#e24c0e", color: "white" }}
            >
              確定修改
            </Button>
           
          </form>
        </Dialog>
        )}
      </Table>
      <TablePagination
        component="div"
        count={filteredProducts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};
