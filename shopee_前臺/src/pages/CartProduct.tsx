import React, { useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import { Theme } from "@mui/material/styles";
import { Grid, Box } from "@mui/material";
import TextField from "@mui/material/TextField"; // 导入 TextField
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "@/Context/CartContext";
import { alpha } from "@mui/material/styles";
import { Toolbar } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Product {
  productId: number;
  productName: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
  description: string;
}

interface CartData {
  cartId: number;
  userId: number;
  totalAmount: number;
  createDate: string;
  lastModifiedDate: string;
  cartItemList: CartItem[];
}

interface CartItem {
  cartItemId: number;
  cartId: number;
  productId: number;
  quantity: number;
  amount: number;
  product: Product;
}
interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
}
interface CartProductProps {
  productId: number;
  quantity: number;
}

const RootPaper = styled(Paper)(({ theme }: { theme: Theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  marginTop: "20px",
  borderRadius: "10px", // 添加圆角属性
  maxWidth: "80%", // 设置最大宽度
  margin: "16px auto 0", // 添加顶部间距
}));

const ContainerPaper = styled(Paper)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  boxShadow: "none",
  borderRadius: "0px",
  position: "relative",
}));

const ImageContainer = styled("div")(({ theme }: { theme: Theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
}));

const Image = styled("img")({
  maxWidth: "70%",
  height: "auto",
});

const DetailsContainer = styled("div")(({ theme }: { theme: Theme }) => ({
  flex: 2,
  padding: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  marginBottom: theme.spacing(1),
  marginTop: "13px",
}));

const Category = styled(Typography)(({ theme }) => ({
  fontSize: "0.5rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  marginTop: "13px",
}));

const Price = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "bold",
  marginRight: "1em",
  marginBottom: theme.spacing(2),
  marginTop: "13px",
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "bold",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const QuantityContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
});

const CustomIconButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  backgroundColor: "#999", // 设置按钮的背景颜色为红色
  color: theme.palette.common.white,
  borderRadius: "4px",
  padding: "4px",
  "&:hover": {
    backgroundColor: "#666", // 鼠标悬停时的背景颜色
  },
}));

const QuantityText = styled(Typography)({
  fontSize: "1.25rem",
  fontWeight: "bold",
});

const InnerPaper = styled(Paper)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(2),
  boxShadow: "none",
  borderRadius: "8px",
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f2f2f2",
  marginTop: "13px",
}));
//購物車bar 計算 selected
interface EnhancedTableToolbarProps {
  numSelected: number;
}


const CartProduct: React.FC = () => {
  const [selectAll, setSelectAll] = useState(false); // 全选状态
  // const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState<string[]>([]); // 使用string数组来存储选中的项目ID
  const [cartDataFromApi, setCartDataFromApi] = useState<CartData | null>(null); // 更改了命名以避免與cart混淆
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(true);
  // const { setSelectedItemIds, toggleSelectedItem } = context;

  const context = useContext(CartContext); // 使用React的Context API來獲取購物車的上下文

  if (!context) {
    throw new Error("CartProduct must be used within a CartProvider"); // 檢查否存在，如果不存在則拋出錯誤
  }
  const { setSelectedItemIds, toggleSelectedItem } = context;
  // const [itemSelections, setItemSelections] = useState({});

  const { cart, changeQuantity, selectedItems, clearCart  } = context;// Destructure cart and other variables

  const [selectItems, setSelectItems] = useState<{ [index: number]: boolean }>(
    {}
  ); // 用來跟踪每個項目的選擇狀態的新狀態

  const handleRemoveAllFromCart = () => {
    clearCart(); // Call the clearCart function to remove all items from the cart
  };
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // 如果当前是未全选状态，则全选所有项目
      setIsCheck(cart.map((item) => item.product.productId.toString()));
    } else {
      // 如果当前是全选状态，则取消全选
      setIsCheck([]);
    }
  };
  useEffect(() => {
    if (selectAll) {
      // 如果selectAll為true，則將所有項目的ID收集到一個數組中並設置為selectedItemIds

      const allProductIds = cart.map((item) => item.product.productId);
      setSelectedItemIds(allProductIds);
    } else {
      // 如果selectAll為false，則清空selectedItemIds
      setSelectedItemIds([]);
    }
  }, [selectAll, cart, setSelectedItemIds]);

  console.log(isCheck);
  useEffect(() => {
    if (isCheck.length === cart.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [isCheck, cart.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userId");

        if (userId) {
          const response = await axios.get(
            `http://localhost:8080/users/${userId}/carts`
          ); // 更新狀態變量，保存API返回的購物車數據
          setCartDataFromApi(response.data.result[0]); // 获取第一个购物车数据
          if (
            response.data.result[0].cartItemList &&
            response.data.result[0].cartItemList.length > 0
          ) {
            // 更新單價狀態變量
            setUnitPrice(response.data.result[0].cartItemList[0].price);
          }
        } else {
          console.error("User ID not found in session storage");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleIncrement = (productId: number, currentQuantity: number) => {
    changeQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      changeQuantity(productId, currentQuantity - 1);
    }
  };

  const handleDeleteClick = () => {
    setIsVisible(false);
  };

  const handleCheckout = () => {
    console.log("Checkout initiated for selected items: ", selectedItems);
  };

  // const handleCheckboxChange = (productId: number) => {
  //   const productIdString = productId.toString();
  //   setIsCheck((prevIsCheck) => {
  //     if (prevIsCheck.includes(productIdString)) {
  //       return prevIsCheck.filter((id) => id !== productIdString);
  //     } else {
  //       return [...prevIsCheck, productIdString];
  //     }
  //   });
  // };

  const totalAmount = cart
    .reduce((total, item) => total + item.product.price * item.quantity, 0)
    .toFixed(2);
    const formattedTotalAmount = parseFloat(totalAmount) === parseInt(totalAmount) ? parseInt(totalAmount).toString() : totalAmount;


    function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
      const { numSelected } = props;
      
    
    
      return (
        //Toolbar 常用於作為應用程序的頭部或工具欄
        <Toolbar
          //定義元件樣式
          sx={{
            //了padding-left（pl）和padding-right（pr）的響應式值。sm和xs是斷點，分別代表小型和超小型螢幕
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              //如果numSelected（選中的商品數）大於0，它將設置背景色為"#e24c0e"的透明版本
              bgcolor: (theme) =>
                alpha("#e24c0e", theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {numSelected > 0 ? (
            <Typography
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} 商品
            </Typography>
          ) : (
            //，:代表否則
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h5"
              id="tableTitle"
              component="div"
            >
              購物車
            </Typography>
          )}
              {numSelected > 0 ? (
            <Tooltip title="Delete">
               <IconButton onClick={handleRemoveAllFromCart}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Filter list">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      );
    }
  return (
    <RootPaper>
      <ContainerPaper>
        {/* <Typography variant="h4" gutterBottom>
          購物車P
        </Typography> */}
        {/* 購物車 -  {isCheck.length} 筆商品 */}

        
        {/* <hr />：水平規則”的邊框樣式,1像素寬，顏色為#ddd（一種淺灰色） */}
        
       <Typography variant="h4">
          {/* 購物車 -  {isCheck.length} 筆商品 */}
          <EnhancedTableToolbar numSelected={isCheck.length} />
        </Typography>
        <hr style={{ border: "1px solid #ddd", marginBottom: "16px" }} /> 
        
        <div
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#fff",
            zIndex: 1000,
          }}
        >
          <Grid container spacing={2} style={{ marginLeft: "1em" }}>
            <Grid item xs={3}>
              <Heading variant="h6">
                <Checkbox
                  checked={selectAll}
                  // onChange={() => setSelectAll(!selectAll)}
                  onChange={handleSelectAll}
                  sx={{
                    color: "success",
                    "&.Mui-checked": { color: "#e24c0e" },
                  }}
                />
                全選
              </Heading>
            </Grid>
            <Grid item xs={3}>
              <Heading variant="h6" style={{ marginLeft: "20px" }}>
                商品詳情
              </Heading>
            </Grid>
            <Grid item xs={2}>
              <Heading variant="h6">單價</Heading>
            </Grid>
            <Grid item xs={2}>
              <Heading variant="h6" style={{ marginLeft: "30px" }}>
                數量
              </Heading>
            </Grid>
            <Grid item xs={2}>
              <Heading variant="h6" style={{ marginRight: "6em" }}>
                總數量
              </Heading>
            </Grid>
          </Grid>
        </div>

        {cart.map((item, index) => (
          <InnerPaper key={index}>
            <Checkbox
              checked={isCheck.includes(item.product.productId.toString())}
              sx={{ color: "success", "&.Mui-checked": { color: "#e24c0e" } }}
              onChange={() => {
                // handleCheckboxChange(item.product.productId);
                const currentProductId = item.product.productId.toString();
                if (isCheck.includes(currentProductId)) {
                  setIsCheck(isCheck.filter((id) => id !== currentProductId));
                } else {
                  setIsCheck([...isCheck, currentProductId]);
                }
                context.toggleSelectedItem(item.product.productId);
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={3}>
                <ImageContainer>
                  <Image
                    src={item.product.imageUrl || "fallbackImageURL"}
                    alt="Product"
                  />
                </ImageContainer>
              </Grid>
              <Grid item xs={3}>
                <DetailsContainer>
                  <Title variant="h1">{item.product.productName}</Title>
                  <Category variant="body2">{item.product.category}</Category>
                </DetailsContainer>
              </Grid>
              <Grid item xs={2}>
                <DetailsContainer>
                  <Price variant="h3">${item.product.price.toFixed(2)}</Price>
                </DetailsContainer>
              </Grid>
              <Grid item xs={2}>
                <DetailsContainer
                  style={{ marginRight: "20px", marginTop: "10px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "4em",
                    }}
                  >
                    <CustomIconButton
                      onClick={() =>
                        handleDecrement(item.product.productId, item.quantity)
                      }
                      size="small"
                      disabled={item.quantity === 1}
                    >
                      <RemoveIcon />
                    </CustomIconButton>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <TextField
                        type="number"
                        variant="outlined"
                        size="small"
                        value={item.quantity}
                        onChange={(e) =>
                          changeQuantity(
                            item.product.productId,
                            Number(e.target.value)
                          )
                        }
                        inputProps={{ min: "1" }}
                        style={{ width: "60px", textAlign: "center" }}
                      />
                    </div>
                    <CustomIconButton
                      onClick={() =>
                        handleIncrement(item.product.productId, item.quantity)
                      }
                      size="small"
                    >
                      <AddIcon />
                    </CustomIconButton>
                  </div>
                </DetailsContainer>
              </Grid>

              <Grid item xs={2}>
                <DetailsContainer>
                  <Typography
                    variant="h5"
                    style={{
                      color: "#e24c0e",
                      fontSize: "16px",
                      marginLeft: "35px",
                      marginTop: "15px",
                    }}
                  >
                    {/* {(item.product.price * item.quantity).toFixed(2)} */}
                    {formattedTotalAmount}
                  </Typography>
                </DetailsContainer>
              </Grid>
            </Grid>

            <Typography variant="body2" style={{ color: "#666" }}>
              <DeleteIcon
                style={{ color: "#666", fontSize: 20 }}
                onClick={() =>
                  context.removeProductFromCart(item.product.productId)
                }
              />
            </Typography>
          </InnerPaper>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <Typography
            variant="h5"
            style={{ color: "#e24c0e", marginRight: "8px" }}
          >
             ${formattedTotalAmount}

          </Typography>
          <Link to="/Check">
            <Button
              variant="contained"
              style={{ backgroundColor: "#e24c0e", color: "white" }}
              onClick={handleCheckout}
            >
              结账
            </Button>
          </Link>
        </div>
      </ContainerPaper>
    </RootPaper>
  );
};

export default CartProduct;
