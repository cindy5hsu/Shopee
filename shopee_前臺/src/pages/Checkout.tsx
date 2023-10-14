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
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import LocationOnIcon from '@mui/icons-material/LocationOn';

import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "@/Context/CartContext";
// import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


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

// TableContainer
const StyledTableContainer = styled(Paper)(({ theme }: { theme: Theme }) => ({
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
const addressStyle = {
  display: 'flex',
  alignItems: 'center',
};

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
const typographyStyle = {
  display: "flex",
  alignItems: "center",
  // padding: theme.spacing(2),
  // marginBottom: theme.spacing(2),
  marginTop: "20px",
 
  maxWidth: "80%",
  margin: "16px auto 0",
};

//以下為table 内容
const TAX_RATE = 0.07;

function ccyFormat(num: number) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty: number, unit: number) {
  return qty * unit;
}

function createRow(desc: string, qty: number, unit: number) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

interface Row {
  desc: string;
  qty: number;
  unit: number;
  price: number;
}

function subtotal(items: readonly Row[]) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}
const customColorStyle = {
  color: '#e24c0e', // Your custom color code
};

const rows = [
  createRow('Paperclips (Box)', 100, 1.15),
  createRow('Paper (Case)', 10, 45.99),
  createRow('Waste Basket', 2, 17.99),
];


const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;


const Checkout: React.FC = () => {
  const context = useContext(CartContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const location = useLocation();
  const selectedProductIds = location.state?.selectedProductIds;
  const selectedItems = context?.selectedItems;
  const [totalAmount, setTotalAmount] = useState("0");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleClickOpen = async () => {
    setOpenDialog(true);
    const userdetails = {
      name: name,
      address: address,
      phone: phone,
    };

    try {
      // 使用 fetch 函數發送一個 POST 請求到指定的 API endpoint
      // 用戶的詳細資料被轉換成 JSON 格式並作為請求的 body 發送
      // 注意: userId 應該是已經在此腳本的其他地方定義的變量
      const response = await fetch(
        `http://localhost:8080/user/${sessionStorage.getItem("userId")}/userdetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // 設置請求頭，告知服務器我們正在發送 JSON 資料
          },
          body: JSON.stringify(userdetails), // 將用戶詳細資料物件轉換為 JSON 字符串
        }
        
  
      );const newAddressText = `${address} ${name}（${phone} 收）`; // 創建新的地址文字
        const addressElement = document.getElementById('address-text'); // 獲取 "寄送至:" 的元素
        if (addressElement) {
          addressElement.textContent = `寄送至: ${newAddressText}`;
        }

      // 檢查回應是否為 OK (HTTP 狀態碼 200-299)
      // 如果不是，則拋出一個新的錯誤
      if (!response.ok) {
        throw new Error("網路回應不正確");
      }

      // 解析回應的 JSON 資料
      const responseData = await response.json();
      // 在控制台中打印回應資料
      console.log("回應資料:", responseData);
    } catch (error) {
      // 如果有任何錯誤，將它捕捉並在控制台中打印
      console.error("錯誤:", error);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  if (!context) {
    throw new Error("CartProduct must be used within a CartProvider");
  }

  const { cart, changeQuantity } = context;

  useEffect(() => {
    console.log(selectedProductIds); //將能夠看到傳遞的商品ID
  }, [selectedProductIds]);

  const handleIncrement = (productId: number, currentQuantity: number) => {
    changeQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      changeQuantity(productId, currentQuantity - 1);
    }
  };

  const handleCheckout = () => {
    setOpenCircularProgress(true);
    // 在這裡處理結賬邏輯

    setTimeout(() => {
        setOpenCircularProgress(false);
    },2000);
  };

  useEffect(() => {
    if (selectedItems) {
      const newTotalAmount = selectedItems
        .reduce((total, item) => total + item.product.price * item.quantity, 0)
        .toFixed(2);
      setTotalAmount(newTotalAmount);
    }
  }, [selectedItems]);

  return (
    <div>
      
      <Typography variant="h5"  style={typographyStyle}>
          確認收貨地址
        </Typography>
        <div style={{ ...addressStyle, ...typographyStyle }}>
        {/* 圆形复选框 */}
        
        <Checkbox
                  checked={true}
                  // onChange={() => setSelectAll(!selectAll)}
                    size="small"
                  sx={{
                  
                    color: "success",
                    "&.Mui-checked": { color: "primary" },
                  }}
                />
        {/* 地标图标 */}
        <LocationOnIcon  sx={customColorStyle} style={{ marginRight: '8px' }} />
        {/* 地址文本 */}
        {/* 寄送至: 福建省福州市平潭县澳前镇澳前西路邮政大厅8区88号万集集运（5许雅婷(267671） 收）18929152767
        默认地址修改本地址 */}
        <span id="address-text">
          寄送至: {`${address} ${name}（${phone} 收）`}
        </span>
        <Button
        variant="outlined"
        style={{
          backgroundColor: "#e24c0e",
          color: "white",
          position: "relative",
          bottom: "-20px",
          right: "-15em",
        }}
        onClick={handleClickOpen}
      >
        修改地址
      </Button>
      </div>
      <Button
        variant="outlined"
        style={{
          backgroundColor: "#e24c0e",
          color: "white",
          position: "relative",
          bottom: "-20px",
          right: "-15em",
        }}
        onClick={handleClickOpen}
      >
        使用新地址
      </Button>

      <RootPaper>
        <ContainerPaper>
          <Grid container spacing={2} style={{ marginLeft: "2em" }}>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <Heading variant="h6" style={{ marginRight: "20px" }}>
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
              <Heading variant="h6">總價格</Heading>
            </Grid>
          </Grid>

          {selectedItems?.map((item, index) => (
            <InnerPaper key={index}>
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
                      {(item.product.price * item.quantity).toFixed(2)}
                    </Typography>
                  </DetailsContainer>
                </Grid>
              </Grid>
            </InnerPaper>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <Typography variant="h5" style={{ marginRight: "8px" }}>
              實付金額:
            </Typography>
            <Typography
              variant="h5"
              style={{ color: "#e24c0e", marginRight: "8px" }}
            >
              ${totalAmount}
            </Typography>
            <Button
              variant="contained"
              style={{ backgroundColor: "#e24c0e", color: "white" }}
              onClick={handleCheckout}
            >
              提交訂單
            </Button>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={openCircularProgress}
              onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        </ContainerPaper>
      </RootPaper>
      {/* table詳細資訊 */}
      <StyledTableContainer>
      {/* <TableContainer component={Paper}> */}
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        {/* <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={3}>
              Details
            </TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Desc</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Unit</TableCell>
            <TableCell align="right">Sum</TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.unit}</TableCell>
              <TableCell align="right">{ccyFormat(row.price)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Tax</TableCell>
            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    {/* </TableContainer> */}
      </StyledTableContainer>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>新增收貨地址</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="詳細地址" fullWidth
          onChange={(e) => setAddress(e.target.value)} />
          <TextField margin="dense" label="收貨人姓名" fullWidth 
          onChange={(e) => setName(e.target.value)}/>
          <TextField margin="dense" label="手機號碼" fullWidth 
          onChange={(e) => setPhone(e.target.value)}/>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            style={{ backgroundColor: "#e24c0e", color: "white" }}
            onClick={handleClose}
          >
            取消
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#e24c0e", color: "white" }}
            onClick={handleClose}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Checkout;

interface ButtonProps {
  variant?: string;
  style: React.CSSProperties;
  onClick: () => void;
  children: React.ReactNode;
}

function Button({ variant, style, onClick, children }: ButtonProps) {
  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
}
