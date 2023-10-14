import React, { createContext, useState, useContext, ReactNode } from 'react';
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
//包含了購物車狀態和一些方法來更改購物車狀態
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
//允許你在你的應用中任何地方訪問購物車狀態和方法
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  // const userId = sessionStorage.getItem('userId');
  //一個可選的屬性，存儲所有選中的商品ID的陣列。 狀態設定函數，用於更新 selectedItemIds 陣列。
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  // 將選中的商品ID保存到sessionStorage
  sessionStorage.setItem("selectedProductIds", JSON.stringify(selectedItemIds));

  
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
  
    // 在這裡添加你的 axios.post 請求，並使用 then 等待其完成
    const buyItemList = [
      { productId: product.productId, quantity },
    ];
    // sessionStorage.getItem('userId');
    axios.post(`http://localhost:8080/users/${sessionStorage.getItem('userId')}/carts`, {
      buyItemList,
    })
    .then(response => {
      console.log("Response from server: ", response);
      // 只有當請求成功時才更新本地購物車狀態
      setCart([...cart, { product, quantity }]);
      setSelectedItemIds(prevState => [...prevState, product.productId]);  // 新增此行來更新 selectedItemIds

    })
    .catch(error => {
      console.error("Error posting to server: ", error);
    });
  };
  
  const clearCart = () => {
    setCart([]);
    setSelectedItemIds([]); // Clear selected items as well
    
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

    // 返回一個上下文提供者，它提供了購物車的狀態和方法
  return (
    <CartContext.Provider value={{  cart, selectedItems, addToCart, removeProductFromCart, changeQuantity, 
      toggleSelectedItem, selectedItemIds, setSelectedItemIds, clearCart,  }}>  {/* 更新此行 */}
    {children}
  </CartContext.Provider>
  );
};
