import React, { useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Theme } from "@mui/material/styles";
import { Grid, Box } from "@mui/material";
import TextField from "@mui/material/TextField"; // 导入 TextField
import { useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import { CartContext } from "@/Context/CartContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { ChangeEvent } from "react";

interface Product {
  productId: number;
  productName: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
  description: string;
}

interface Order {
  orderId: number;
  userId: number;
  totalAmount: number;
  createdDate: string;
  lastModifiedDate: string;
  orderItem: OrderItem[];
}

interface OrderItem {
  orderItemId: number;
  orderId: number;
  productId: number;
  quantity: number;
  amount: number;
  product: Product;
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
interface LocationState {
  selectedProductIds?: string[];
}

const RootPaper = styled(Paper)(({ theme }: { theme: Theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  marginTop: "20px",
  borderRadius: "10px", 
  maxWidth: "80%",
  margin: "16px auto 0",
}));

// TableContainer
const StyledTableContainer = styled(Paper)(({ theme }: { theme: Theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  marginTop: "20px",
  borderRadius: "10px", 
  maxWidth: "80%",
  margin: "16px auto 0",
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
  display: "flex",
  alignItems: "center",
};

const QuantityContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: "10px",
});

const CustomIconButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  backgroundColor: "#999", 
  color: theme.palette.common.white,
  borderRadius: "4px",
  padding: "4px",
  "&:hover": {
    backgroundColor: "#666",
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
  marginTop: "20px",

  maxWidth: "80%",
  margin: "16px auto 0",
};
const handlePaymentMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
  const selectedPaymentMethod = event.target.value;
};
const TAX_RATE = 0.07;

function ccyFormat(num: number) {
  return `${num}`;
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
  color: "#e24c0e", 
};

const rows = [
  createRow("Paperclips (Box)", 100, 1.15),
  createRow("Paper (Case)", 10, 45.99),
  createRow("Waste Basket", 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

const Checkout: React.FC = () => {
  const context = useContext(CartContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const location = useLocation();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const selectedProductIds = (location.state as LocationState)
    ?.selectedProductIds;
  const selectedItems = context?.selectedItems;
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [ setUserdetails] = useState<any>(null); 

  async function fetchUserDetails(userId: number) {
    console.log(`Fetching details for user with ID ${userId}`);

    
    const searchIdRequest = {
      userId: userId, 
    };

    try {
      const userId = sessionStorage.getItem("userId");

      const response = await fetch("http://localhost:8080/user/userdetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchIdRequest),
      });

      console.log("HTTP response code:", response.status);

      if (response.status === 200) {
        const data = await response.json();
        console.log("Received data:", data);
        setName(data.name);
        setAddress(data.address);
        setPhone(data.phone);
      } else {
        console.log("Server returned status code:", response.status);
        const text = await response.text();
        console.log("Received:", text);
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  }
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      fetchUserDetails(Number(storedUserId)); 
    }
  }, []); 

  const handleSaveAndConfirm = async () => {
    setOpenDialog(true);
    const userdetails = {
      name: name,
      address: address,
      phone: phone,
    };
    const userId = sessionStorage.getItem("userId");
    const apiUrl = `http://localhost:8080/user/${userId}/userdetails`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(userdetails), 
      });

      const text = await response.text();
      console.log("Raw response:", text);

      if (response.status === 200) {
        const data = JSON.parse(text);
        if (data.error) {
          console.error("Server returned an error:", data.error);
        } else {
          setUserdetails(data);
        }
      } else {
        console.error(
          `Received unexpected status ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("發生網路請求錯誤:", error);
    }
    finally {
      setOpenDialog(false);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  if (!context) {
    throw new Error("CartProduct must be used within a CartProvider");
  }

  const { changeQuantity } = context;

  useEffect(() => {
    console.log(selectedProductIds); 
  }, [selectedProductIds]);

  const handleIncrement = (productId: number, currentQuantity: number) => {
    changeQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      changeQuantity(productId, currentQuantity - 1);
    }
  };
  const handleCheckout = async () => {
    setOpenCircularProgress(true);

    const buyItemList =
      selectedItems?.map((item) => ({
        productId: item.product.productId,
        quantity: item.quantity,
      })) || [];

    const userId = sessionStorage.getItem("userId");

    const order = {
      userId: Number(userId),
      buyItemList: buyItemList,
    };
    axios
      .post(`http://localhost:8080/users/${userId}/orders`, order)
      .then((response) => {
        console.log("Response from server: ", response.data);

        setTimeout(() => {
          setOpenCircularProgress(false);
          setShouldNavigate(true); 
        }, 2000);
      })
      .catch((error) => {
        console.error("Error posting to server: ", error);
        console.error("Error status code: ", error.response?.status);
        console.error("Error response data: ", error.response?.data);
      });
  };

  useEffect(() => {
    if (shouldNavigate) {
      window.location.href = "/shopee/order";
    }
  }, [shouldNavigate]);

  useEffect(() => {
    if (selectedItems) {
      const newTotalAmount = selectedItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      setTotalAmount(newTotalAmount);
    }
  }, [selectedItems]);

  return (
    <div>
      <Typography variant="h5" style={typographyStyle}>
        確認收貨地址
      </Typography>
      <div style={{ ...addressStyle, ...typographyStyle }}>
      
        <LocationOnIcon sx={customColorStyle} style={{ marginRight: "8px" }} />
       
        <span id="address-text">
          <span style={{ color: "#e24c0e" }}>寄送至: </span> {address} {phone}（
          {name} 收）
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
          onClick={() => setOpenDialog(true)}
        >
          修改地址
        </Button>
      </div>

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
                    <Price variant="h3">${item.product.price}</Price>
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
                      {item.product.price * item.quantity}
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
              // onClick={handleCheckout}
              onClick={() => handleCheckout()}
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
      <StyledTableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableBody>
            <TableRow>
              <TableCell rowSpan={4} />
              <TableCell colSpan={2}>付款方式</TableCell>
              <TableCell align="right">
                <select onChange={handlePaymentMethodChange}>
                  <option value="credit_card">信用卡 / 借記卡</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">貨到付款</option>
                  <option value="bank_transfer">銀行轉賬</option>
                  <option value="apple_pay">Apple Pay</option>
                </select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>姓名</TableCell>
              <TableCell align="right">{name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>地址</TableCell>
              <TableCell align="right">{address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>總價格</TableCell>
              <TableCell align="right">{totalAmount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {/* </TableContainer> */}
      </StyledTableContainer>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>修改收貨地址</DialogTitle>
        <DialogContent>
          地址：
          <TextField
            margin="dense"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          姓名：
          <TextField
            margin="dense"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          電話：
          <TextField
            margin="dense"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
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
            onClick={handleSaveAndConfirm}
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

function Button({ style, onClick, children }: ButtonProps) {
  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
}
