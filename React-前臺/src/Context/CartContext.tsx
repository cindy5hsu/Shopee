import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';


interface Product {
  productId: number;
  productName: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
  description: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface User {
  userId: number;
}
//狀態和一些方法來更改購物車狀態
interface CartContextProps {
  cart: CartItem[];
  selectedItems: CartItem[];  // 在此处添加新属性
  addToCart: (product: Product, quantity: number) => void;
  removeProductFromCart: (productId: number) => void;
  changeQuantity: (productId: number, quantity: number) => void;
  selectedItemIds?: number[];
  setSelectedItemIds: React.Dispatch<React.SetStateAction<number[]>>;
  toggleSelectedItem: (productId: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextProps | undefined>(undefined);
//允許應用中任何地方訪問購物車狀態和方法
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  // 將選中的商品ID保存到localStorage
  localStorage.setItem("selectedProductIds", JSON.stringify(selectedItemIds));

  
  const toggleSelectedItem = (productId: number) => {
    setSelectedItemIds(prevState => {
      console.log("Current state of selectedItemIds:", prevState); 
      console.log("Toggling product ID:", productId); 
  
      if (prevState.includes(productId)) {
        return prevState.filter(id => id !== productId);
      } else {
        return [...prevState, productId];
      }
    });
  };
  
  const addToCart = (product: Product, quantity: number) => {
    console.log("addToCart called with", product, quantity);
  
    // 檢查商品是否已經存在於購物車中
    const existingCartItem = cart.find(item => item.product.productId === product.productId);
  
    if (existingCartItem) {
      // 商品已存在，增加數量
      const updatedCart = cart.map(item => {
        if (item.product.productId === product.productId) {
          return { ...item, quantity: item.quantity + quantity };
        }
        return item;
      });
  
      setCart(updatedCart);
    } else {
      // 商品不在購物車中，將其添加到購物車
      const buyItemList = [{ productId: product.productId, quantity }];
  
      axios
        .post(`http://localhost:8080/users/${sessionStorage.getItem('userId')}/carts`, {
          buyItemList,
        })
        .then(response => {
          console.log("Response from server: ", response);
          // 只有當請求成功時才更新本地購物車狀態
          setCart([...cart, { product, quantity }]);
          setSelectedItemIds(prevState => [...prevState, product.productId]);
        })
        .catch(error => {
          console.error("Error posting to server: ", error);
        });
    }
  };
  
  const clearCart = () => {
    // 過濾出要保留的商品，即未選中的商品
  const updatedCart = cart.filter(item => !selectedItemIds.includes(item.product.productId));

  // 更新購物車和選中的商品列表
  setCart(updatedCart);
  setSelectedItemIds([]); // 清空選中的商品列表
    
  };
  

  const removeProductFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter(item => item.product.productId !== productId));
  };
  // 方法：更改購物車中產品的數量
  const changeQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) => 
      prevCart.map(item => 
        item.product.productId === productId 
        ? { ...item, quantity } 
        : item
      )
    );
  };
  //定義了 selectedItems 狀態，它是通過篩選 cart 中與 selectedItemIds 匹配的項目來得到的。
  // 計算被選中的商品列表
  const selectedItems = cart.filter(item => selectedItemIds.includes(item.product.productId));

    // 提供狀態和方法
  return (
    <CartContext.Provider value={{  cart, selectedItems, addToCart, removeProductFromCart, changeQuantity, 
      toggleSelectedItem, selectedItemIds, setSelectedItemIds, clearCart  }}>  
    {children}
  </CartContext.Provider>
  );
};
