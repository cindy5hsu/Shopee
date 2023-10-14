import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
  IconButton,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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
  userId: number;
  createdDate: string;
  lastModifiedDate: string;
  orderId: number;
  orderItemList: {
    productName: string;
    quantity: number;
    amount: number;
  }[];
  createDate: string;
  totalAmount: number;
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

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({}); 
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

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

  const StyledTableCell = styled(TableCell)(({ theme }: { theme?: Theme }) => ({
    padding: theme?.spacing(2),
  }));

  const StyledTableRow = styled(TableRow)(
    ({ theme, index }: { theme?: Theme; index: number }) => ({
      backgroundColor: index % 2 === 0 ? "rgba(0, 0, 0, 0.05)" : "white",
      height: "60px", // 设置行高
    })
  );

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (userId) {
      axios
        .get(`http://localhost:8080/users/${userId}/orders`)
        .then((response) => {
          if (Array.isArray(response.data.result)) {
            setOrders(response.data.result);
          } else {
            console.error(
              "Unexpected response data format:",
              response.data.result
            );
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the orders!", error);
        });
    }
  }, []);

  const toggleRowOpen = (orderId: number) => {
    setOpenRows({
      ...openRows,
      [orderId]: !openRows[orderId],
    });
  };

  return (
    <RootPaper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>訂單序號</TableCell>
              <TableCell>商品名稱</TableCell>
              <TableCell>日期</TableCell>
              <TableCell>總金額</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(orders) &&
              orders.map((order: Order, index: number) => (
                <>
                  <StyledTableRow key={order.orderId} index={index}>
                    <StyledTableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowOpen(order.orderId)}
                      >
                        {openRows[order.orderId] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell>{order.orderId}</StyledTableCell>
                    <StyledTableCell>
                      {order.orderItemList[0]?.productName}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Date(order.createDate).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell>{order.totalAmount}</StyledTableCell>
                  </StyledTableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={openRows[order.orderId] ?? false}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  style={{
                                    color: "#e65100",
                                    textAlign: "center",
                                  }}
                                >
                                  商品名稱
                                </TableCell>
                                <TableCell
                                  style={{
                                    color: "#e65100",
                                    textAlign: "center",
                                  }}
                                >
                                  數量
                                </TableCell>
                                <TableCell
                                  style={{
                                    color: "#e65100",
                                    textAlign: "center",
                                  }}
                                >
                                  金額
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.orderItemList.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell style={{ textAlign: "center" }}>
                                    {item.productName}
                                  </TableCell>
                                  <TableCell style={{ textAlign: "center" }}>
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell style={{ textAlign: "center" }}>
                                    {item.amount}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  style={{
                                    color: "#e65100",
                                    textAlign: "center",
                                  }}
                                >
                                  姓名
                                </TableCell>
                                <TableCell
                                  style={{
                                    color: "#e65100",
                                    textAlign: "center",
                                  }}
                                >
                                  地址
                                </TableCell>
                                <TableCell
                                  style={{
                                    color: "#e65100",
                                    textAlign: "center",
                                  }}
                                >
                                  電話號碼
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell style={{ textAlign: "center" }}>
                                  {name}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  {address}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  {phone}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </RootPaper>
  );
};

export default OrderPage;
