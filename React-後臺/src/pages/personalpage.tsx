import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";

const PersonalPage: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");


  const handleSubmit = async () => {
    const userdetails = {
      name: name,
      address: address,
      phone: phone,
    };
  
    const userId = localStorage.getItem("userId");
    const apiUrl = `http://localhost:8080/user/${userId}/userdetails`;
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 根据API要求设置适当的Content-Type
        },
        body: JSON.stringify(userdetails), // 将用户数据转换为JSON字符串并发送
      });
  
      if (response.ok) {
        // 请求成功，可以处理响应
                // setUserData(userdetails);

        console.log("使用者資料已成功提交");
      } else {
        // 请求失败，处理错误
        console.error("提交使用者資料時發生錯誤");
      }
    } catch (error) {
      // 处理网络请求或其他错误
      console.error("發生網路請求錯誤:", error);
    }
  };
  

  return (
    
    <Container
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: "50px",
      }}
    >
      {/* 左侧个人信息输入框 */}
      <div style={{ flex: 1, marginRight: "20px" }}>
        <Typography
          variant="h5"
          style={{ marginBottom: "20px", textAlign: "center" }}
        >
          輸入資訊
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          label="姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: "20px" }}
        />

        <TextField
          fullWidth
          variant="outlined"
          label="手機"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ marginBottom: "20px" }}
        />

        <TextField
          fullWidth
          variant="outlined"
          label="地址"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ marginBottom: "20px" }}
        />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#e24c0e", color: "#fff" }}
            onClick={handleSubmit}
          >
            提交
          </Button>
        </div>
      </div>

      {/* 右侧购物车显示内容 */}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h5"
          style={{ marginBottom: "20px", textAlign: "center" }}
        >
          個人資訊
        </Typography>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "200px", height: "250px" }}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                姓名：
                </Typography>
                <div style={{ marginBottom: "20px" }}></div> {/* 空行 */}

                <Typography variant="body2" color="text.secondary">
                {name}
                </Typography>
                <div style={{ marginBottom: "20px" }}></div> {/* 空行 */}

                <Typography gutterBottom variant="h5" component="div">
                手機：
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {phone}
                </Typography>
                <div style={{ marginBottom: "20px" }}></div> {/* 空行 */}

                <Typography gutterBottom variant="h5" component="div">
                地址：
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {address}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default PersonalPage;
