import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Divider,
  Button,
  Collapse,
  IconButton,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PrintIcon from "@mui/icons-material/Print";
import { Autocomplete } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TablePagination from "@mui/material/TablePagination";

interface OrderDetail {
  orderItemId: number;
  orderId: number;
  productId: number;
  quantity: number;
  amount: number;
  productName: string;
  imageUrl: string;
}

interface Order {
  orderId: number;
  userId: number;
  totalAmount: number;
  createDate: string;
  lastModifiedDate: string;
  email: string;
  selected: boolean; // 添加 selected 属性
  status: string;
  orderItemList: OrderDetail[];
}
const statuses = ["待處理", "已出貨", "已完成", "已取消"];

const printOrder = (order: Order) => {
  let printContent = `<html><head><title>訂單 ${order.orderId} 詳細信息</title></head><body>`;
  printContent += `<h1>訂單編號 ${order.orderId} 的詳細信息</h1>`;
  printContent += `<p>用戶信箱: ${order.email}</p>`;
  printContent += `<p>總金額: ${order.totalAmount}</p>`;
  printContent += `<p>出貨日期: ${order.createDate}</p>`;
  printContent += `<p>訂單日期: ${order.createDate}</p>`;
  printContent += `<p>狀態: ${order.status}</p>`;
  printContent += "<h2>產品:</h2>";
  printContent += "<ul>";
  order.orderItemList.forEach((detail) => {
    printContent += `<li>${detail.productName} (數量: ${detail.quantity}, 價格: ${detail.amount})</li>`;
  });
  printContent += "</ul>";
  printContent += "</body></html>";

  const printWindow = window.open("", "_blank", "height=400,width=600");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.addEventListener("load", function () {
      printWindow.print();
    });
  }
};

export default function CollapsibleTable() {
  const [rows, setRows] = useState<Order[]>([]);
  const [openRows, setOpenRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0); // for pagination
  const [rowsPerPage, setRowsPerPage] = useState(6); // for pagination

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    const apiUrl = "http://localhost:8080/orders";

    // Fetch data from the API when the component mounts
    axios
      .get(apiUrl)
      .then((response) => {
        // 在这里为每个订单手动添加一个状态字段，默认设置为 "待處理"
        const formattedRows = response.data.result.map((order: Order) => ({
          ...order,
          status: "待處理",
          // 格式化 createDate 和 lastModifiedDate 字段
          createDate: formatDateTime(order.createDate),
          lastModifiedDate: formatDateTime(order.lastModifiedDate),
        }));
        setRows(formattedRows);
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  }, []);

  // 格式化日期时间函数
  const formatDateTime = (dateTimeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
  };
  // 筛选搜索词的订单
  const filteredRows = rows.filter((row) => {
    if (row.email) {
      return row.email.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 6));
    setPage(0);
  };

  const displayProducts = filteredRows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  
//是TypeScript中用来描述事件对象的类型的
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    const newRows = rows.map((row) => ({//每一行
      ...row,//展开（spread operator）
      selected: isChecked,
    }));
    setRows(newRows);//更新
  };
  


  const handleBulkShipping = () => {
    const updatedRows = rows.map((row) =>
      row.selected && row.status === "待處理"
        ? { ...row, status: "已出貨" }
        : row
    );
    setRows(updatedRows);
  };

  return (
    <div style={{ padding: "2em" }}>
      <Typography variant="h4" gutterBottom>
        訂單管理
      </Typography>
      <Divider />
      <Autocomplete
        options={filteredRows}
        getOptionLabel={(option: Order) => option.email}
        onInputChange={(event, newInputValue) => {
          setSearchTerm(newInputValue);
        }}
        renderInput={(params) => <TextField {...params} label="搜索訂單" />}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
              
                <Checkbox
                  indeterminate={
                    rows.some((row) => row.selected) && //是否有
                    !rows.every((row) => row.selected)  
                  }
                  checked={rows.every((row) => row.selected)}//row中是否選中
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>訂單編號</TableCell>
              <TableCell>信箱</TableCell>
              <TableCell>總金額</TableCell>
              <TableCell>出貨日期</TableCell>
              <TableCell>訂單日期</TableCell>
              <TableCell>狀態</TableCell>
              <TableCell align="right">
              
                <Button
                  variant="contained"
                  startIcon={<LocalShippingIcon />}
                  onClick={handleBulkShipping}
                  style={{ backgroundColor: "#e24c0e", color: "white" }}
                >
                  一鍵出貨
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayProducts.map((row) => (
              <React.Fragment key={row.orderId}>
                <TableRow
                  style={{
                    backgroundColor:
                      row.orderId % 2 === 0 ? "rgba(0, 0, 0, 0.04)" : undefined, // 这里设置您喜欢的颜色
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={row.selected || false}
                      onChange={() =>
                        setRows(
                          rows.map((r) =>
                            r.orderId === row.orderId
                              ? { ...r, selected: !r.selected }
                              : r
                          )
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{row.orderId}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.totalAmount}</TableCell>
                  <TableCell>{row.createDate}</TableCell>
                  <TableCell>{row.createDate}</TableCell>
                  <TableCell>
                    <Select
                      value={row.status}
                      onChange={(e) =>
                        setRows(
                          rows.map((r) =>
                            r.orderId === row.orderId
                              ? { ...r, status: e.target.value as string }
                              : r
                          )
                        )
                      }
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() =>
                        setOpenRows(
                          openRows.includes(row.orderId)
                            ? openRows.filter((id) => id !== row.orderId)
                            : [...openRows, row.orderId]
                        )
                      }
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={8}
                  >
                    <Collapse in={openRows.includes(row.orderId)}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>產品</TableCell>
                            <TableCell>數量</TableCell>
                            <TableCell>價格</TableCell>
                            <TableCell align="right">
                              <IconButton
                                color="primary"
                                onClick={() => printOrder(row)}
                              >
                                <PrintIcon style={{ color: "black" }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.orderItemList.map((detail) => (
                            <TableRow key={detail.orderItemId}>
                              <TableCell>{detail.productName}</TableCell>
                              <TableCell>{detail.quantity}</TableCell>
                              <TableCell>{detail.amount}</TableCell>
                              <TableCell align="right" />
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
