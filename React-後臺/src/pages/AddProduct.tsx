
import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
   IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
   Link, 
   List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';


type ProductStatus = "上架" | "下架";

interface NewProduct {
  productName: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
  description: string;
  status: ProductStatus;
}

interface Category {
  categoryId: number;
  categoryName: string;
}
export const AddProduct: React.FC = () => {
  const [product, setProduct] = useState<NewProduct>({
    productName: "",
    category: "",
    imageUrl: "",
    price: 0,
    stock: 0,
    description: "",
    status: "上架",
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);//新增分類
  const [openDialog, setOpenDialog] = useState(false);//刪除分類
  const [isDialogOpen, setIsDialogOpen] = useState(false); // 成功dialog


  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    // 獲取分類
    fetch("http://localhost:8080/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = () => {
    fetch("http://localhost:8080/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productName: product.productName,
        categoryId: product.category,
        imageUrl: product.imageUrl,
        price: product.price,
        stock: product.stock,
        status: product.status === "上架" ? "ON_SHELF" : "OFF_SHELF",
      }),
    })
      .then((response) => response.json()) // 可以獲取到返回的數據
      //.then((data) => console.log(data)) // 在這裡處理返回的數據
      .then((data) => {
        console.log(data);
        // 请求成功后打开对话框
        setIsDialogOpen(true);
      })
      .catch((error) => console.error(error)); // 在這裡捕捉錯誤
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // 处理表单提交
  const handleAddCategory = () => {
    // 创建新的分类
    fetch("http://localhost:8080/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName: newCategoryName }),
    })
      .then((response) => response.json())
      .then((data: Category) => {
        setCategories([...categories, data]);
        setDialogOpen(false);
      });
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

const handleOpenDeleteDialog = () => {
  setOpenDeleteDialog(true);
};

const handleCloseDeleteDialog = () => {
  setOpenDeleteDialog(false);
};
  const handleDeleteCategory = (categoryId: number) => {
    // 在这里执行删除类别的API调用
    fetch(`http://localhost:8080/categories/${categoryId}`, {
      method: 'DELETE',
    }).then(() => {
      // 删除成功后重新从API获取类别
      fetch('http://localhost:8080/categories')
        .then((response) => response.json())
        .then((data) => setCategories(data));
    });
  };

  return (
    <Container style={{ padding: "2em" }}>
     <Grid item xs={11}>
        <Typography variant="h4" gutterBottom>
          新增商品
        </Typography>
      </Grid>
      
      <Grid item  xs={15} container justifyContent="flex-end">
        <IconButton 
          onClick={handleOpenDialog} 
          style={{ backgroundColor: '#e24c0e', color: 'white' }}
        >
          
          <AddIcon />

        </IconButton>
          <span style={{ margin: '0 5px' }}></span>

        <IconButton  onClick={handleOpenDeleteDialog} color="secondary"
        style={{ backgroundColor: '#e24c0e', color: 'white' }}>
            <DeleteIcon />
          </IconButton>
      </Grid>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>选择要删除的类别</DialogTitle>
        <List>
          {categories.map((category) => (
            <ListItem
              button
              onClick={() => handleDeleteCategory(category.categoryId)}
              key={category.categoryId}
            >
              <ListItemText primary={category.categoryName} />
            </ListItem>
          ))}
        </List>
      </Dialog>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="商品名稱"
              variant="outlined"
              value={product.productName}
              onChange={(e) =>
                setProduct({ ...product, productName: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>分類</InputLabel>
              <Select
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value as string })
                }
                label="分類"
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category.categoryId}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
              
              <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>添加新的分類</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="分類名稱"
                    fullWidth
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary">
                    取消
                  </Button>
                  <Button onClick={handleAddCategory} color="primary">
                    添加
                  </Button>
                </DialogActions>
              </Dialog>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="圖片網址"
              variant="outlined"
              value={product.imageUrl}
              onChange={(e) =>
                setProduct({ ...product, imageUrl: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="價格"
              variant="outlined"
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: parseInt(e.target.value) })
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="庫存"
              variant="outlined"
              type="number"
              value={product.stock}
              onChange={(e) =>
                setProduct({ ...product, stock: parseInt(e.target.value) })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="商品描述"
              variant="outlined"
              multiline
              rows={4}
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </Grid>
          {/* <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">商品狀態</FormLabel>
              <RadioGroup
                value={product.status}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    status: e.target.value as ProductStatus,
                  })
                }
              >
                <FormControlLabel
                  value="上架"
                  control={<Radio />}
                  label="上架"
                />
                <FormControlLabel
                  value="下架"
                  control={<Radio />}
                  label="下架"
                />
              </RadioGroup>
             
            </FormControl>
          </Grid> */}
          <Grid item xs={12}>
            <Button variant="contained"  onClick={handleSubmit}
            style={{ backgroundColor: '#e24c0e', color: 'white' }}>
              確定新增
            </Button>
                {/* 成功新增的对话框 */}
      <Dialog open={isDialogOpen}>
        <DialogTitle>成功新增</DialogTitle>
        <DialogContent>您的商品已成功新增。</DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              setOpenDialog(false);
              window.location.href = '/demo/ProMan'; // 使用window.location.href进行跳转
            }}
          >
            返回到 商品管理
          </Button>
        </DialogActions>
      </Dialog>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};
