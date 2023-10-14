import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CartContext } from "../Context/CartContext";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

interface Product {
  productId: number;
  productName: string;
  category: string;
  categoryName: string;
  imageUrl: string;
  price: number;
  stock: number;
  description: string;
}

const RootContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px",
  marginLeft: "15em",
});

const ImageContainer = styled("div")({
  flex: "1",
  marginRight: "16px",
});

const Image = styled("img")({
  maxWidth: "100%",
  height: "auto",
});

const DetailsContainer = styled("div")({
  flex: "2",
});

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  marginBottom: theme.spacing(1),
}));

const Category = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const Price = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
  marginTop: "10px",
  backgroundColor: "#e24c0e",
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: "#ff5722",
  },
}));

const QuantitySelector = styled(TextField)({
  width: "10rem",
  marginRight: "16px",
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SingleProductPage: React.FC = () => {
  const pathname = window.location.pathname;
  const productId = pathname.split("/").pop();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  useEffect(() => {
    console.log("Product ID:", productId); 
    axios
      .get(`http://localhost:8080/products/${productId}`)
      .then((response) => {
        console.log("Server Response:", response.data); 
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [productId]);

  const cartContext = React.useContext(CartContext);

  if (!cartContext) {
    throw new Error("CartContext value is undefined");
  }

  const { addToCart } = cartContext;

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  //成功提示
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleAddToCart = () => {
    const isLoggedin = sessionStorage.getItem("isloggin") === "true";
    if (!isLoggedin) {
      setErrorMessage(
        "你必須登入才能查看和添加商品到購物車"   
      );
      setTimeout(() => {
      window.location.href = '/shopee/Login';
    }, 1000);
    } else if (product) {
      console.log("Adding product to cart", product);
      addToCart(product, quantity);
      handleSnackbarOpen();
    } else {
      console.error("Product is null");
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <RootContainer>
          <ImageContainer>
            <Image
              src={product.imageUrl}
              alt={product.productName}
              style={{
                maxWidth: "400px",
                maxHeight: "600px", 
                width: "auto", 
                height: "auto", 
              }}
            />
          </ImageContainer>
          <DetailsContainer style={{ marginLeft: "30px" }}>
            <Title variant="h2">{product.productName}</Title>
            <Category variant="body2">{product.categoryName}</Category>
            <Price variant="h3">${product.price}</Price>
            <QuantitySelector
              label="數量"
              type="number"
              InputProps={{
                inputProps: {
                  min: 1,
                },
              }}
              value={quantity}
              onChange={handleQuantityChange}
            />
            <div>
              <Stack sx={{ width: "100%" }} spacing={2}>
                {errorMessage && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                  </Alert>
                )}
                <div>
                  <AddToCartButton
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                  >
                    加入購物車
                  </AddToCartButton>{" "}
                  <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                  >
                    <Alert
                      onClose={handleSnackbarClose}
                      severity="success"
                      sx={{ width: "100%" }}
                    >
                      成功加入購物車
                    </Alert>
                  </Snackbar>
                </div>
              </Stack>
            </div>
          </DetailsContainer>
        </RootContainer>
      </div>
      <div style={{ borderTop: "1px solid #ccc", padding: "16px" }}>
        <div style={{ marginTop: "16px" }}>
          <Typography variant="h5">商品詳情</Typography>
          <Typography variant="body1" style={{ marginTop: "20px" }}>
            {product.description}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
