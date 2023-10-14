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
import { useState} from "react";

// import { UserProvider } from "./Context/UserContext";


function App() {
  const [someValue] = useState(0);

  return (
      <CartProvider>
        
        <div className="App">
          <PrimarySearchAppBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/sp/:productId" element={<SingleProductPage />} />
            <Route path="/cart" element={<CartProduct />} />
            {/* <Route path="/cart" element={<CartProduct initialNumSelected={someValue} />} /> */}
            <Route path="/pers" element={<PersonalPage/>}/>
            <Route path="/Check" element={<Checkout/>}/>
          </Routes>
        </div>
      </CartProvider>
  );
}

export default App;
