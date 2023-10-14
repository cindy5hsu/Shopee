import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CartContext } from "../Context/CartContext";
// import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// import { UserContext } from "@/Context/UserContext";

interface Product {
  productId: number;
  productName: string;
  category: string;
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
  // const [isLoggedin, setIsLoggedIn] = React.useState(false); // Add a state for login status
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null); // Specify the type as string | null
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  useEffect(() => {
    console.log("Product ID:", productId); // Log the product ID to verify it

    axios
      .get(`http://localhost:8080/products/${productId}`)
      .then((response) => {
        console.log("Server Response:", response.data); // Log the server response to verify it
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
    // if (product) {
    //   console.log("Adding product to cart", product);
    //   addToCart(product, quantity);
    // } else {
    //   console.error("Product is null");
    // }
    const isLoggedin = sessionStorage.getItem("isloggin") === "true";
    if (!isLoggedin) {
      // If the user is not logged in, set an error message
      setErrorMessage(
        "You must be logged in to view and add items to your cart."
      );
    } else if (product) {
      console.log("Adding product to cart", product);
      addToCart(product, quantity);
      // Open the snackbar upon successful addition to the cart
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
                maxWidth: "400px", // 设置最大宽度
                maxHeight: "600px", // 设置最大高度
                width: "auto", // 让宽度自动调整以保持纵横比
                height: "auto", // 让高度自动调整以保持纵横比
              }}
            />
          </ImageContainer>
          <DetailsContainer style={{ marginLeft: "30px" }}>
            <Title variant="h2">{product.productName}</Title>
            <Category variant="body2">{product.category}</Category>
            <Price variant="h3">${product.price.toFixed(2)}</Price>
            <QuantitySelector
              label="Quantity"
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
              {/* <AddToCartButton
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
              >
                Add to Cart
              </AddToCartButton> */}

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
                    Add to Cart
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

      {/* Description Section */}
      <div style={{ borderTop: "1px solid #ccc", padding: "16px" }}>
        {/* Create a separate container for the description */}
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
