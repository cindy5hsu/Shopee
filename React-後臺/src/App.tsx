import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import { PrimarySearchAppBar } from "./Components/Navbar";
import PersonalPage from "./pages/personalpage";
import MemberManagement from "./pages/MemberManagement";
import CollapsibleTable from "./pages/OrderManagement";
import { AddProduct } from "./pages/AddProduct";
import { ProductList } from "./pages/ProductList";
import Homepage from './Components/HomePage';

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

  return (
        <div className="App">
          <PrimarySearchAppBar />
          <Routes>           
            <Route path="/" element={<Homepage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pers" element={<PersonalPage />} />
            <Route path="/Member" element={<MemberManagement />} />
            <Route path="/OrderMana" element={<CollapsibleTable />} />
            <Route path="/ProMan" element={<ProductList />} />
            <Route path="/AddPro" element={<AddProduct />} />
          </Routes>
        </div>
  );
}

export default App;
