import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./Components/HomePage";
import { PrimarySearchAppBar } from "./Components/Navbar";
import SingleProductPage from "./pages/SingleProduct";
import CartProduct from "./pages/CartProduct";
import { CartProvider } from "./Context/CartContext";
import PersonalPage from "./pages/personalpage";
import Checkout from "./pages/Checkout";
import { useState } from "react";
import OrderPage from "./pages/Order";
import { SearchProvider } from "./Context/SearchContext";

interface Product {
  productId: number;
  productName: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
  description: string;
}
function App() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  const handleSearch = (keyword: string, suggestions: Product[]) => {
    setSearchKeyword(keyword);
    setSuggestions(suggestions);
  };


  return (
    <CartProvider>     
        <SearchProvider>
        <div className="App">
          <PrimarySearchAppBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/sp/:productId" element={<SingleProductPage />} />
            <Route path="/cart" element={<CartProduct />} />
            <Route path="/pers" element={<PersonalPage />} />
            <Route path="/Check" element={<Checkout />} />
            <Route path="/Order" element={<OrderPage />} />
          </Routes>
        </div>
        </SearchProvider>
    </CartProvider>
  );
}

export default App;
