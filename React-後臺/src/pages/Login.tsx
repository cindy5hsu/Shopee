import React, { useState } from "react";
import { Button, Container, TextField, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Paper from "@mui/material/Paper";
import "./Login.css"; // 導入 CSS 文件\
import WorkIcon from "@mui/icons-material/Work";
import { useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate(); // 使用 useNavigate hook 获取导航函数
  const location = useLocation();
  const showBackground = location.pathname === '/Login';

  //確保 Login.css 中的 body 背景只在 /login 路徑下生效
  React.useEffect(() => {
    if (showBackground) {
      document.body.classList.add("login-background");
    }
    return () => {
      document.body.classList.remove("login-background");
    };
  }, [showBackground]);

  // 在组件的 render 方法中
  const styles = {
    backgroundImage: "url('./background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center  50px", // 將背景圖像向下移動 50px
    backgroundRepeat: "no-repeat",
    // backgroundmarginTop: '2em',
    position: "fixed" as "fixed",
    top: 100,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1, // 确保背景在内容之后
  } as React.CSSProperties;

  const handleLogin = async () => {
    let isValid = true;

    if (!email) {
      setEmailError("信箱不能为空");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("密碼不能为空");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) {
      return; // 如果存在错误，不继续执行登录请求
    }

    try {
      // 执行登录请求
      const response = await axios.post("http://localhost:8080/employee/login", {
        email: email,
        password: password,
      });

      console.log(response);

      localStorage.setItem("isloggin", "true");
      localStorage.setItem("islogout", "false");
      localStorage.setItem("userId", response.data.userId);

      navigate("/"); // 登录成功后，导航到主页
    } catch (error) {
      console.error("登入期間出現錯誤:", error);

      // 处理登录失败的情况，例如密码或账号错误
      setEmailError("電子郵件或密碼錯誤");
      setPasswordError("電子郵件或密碼錯誤");
    }
  };

  return (
    <div style={showBackground ? styles : {}}>
      <Container maxWidth="sm" className="login-container">
        <Paper elevation={2} style={{ borderRadius: "10px", padding: "15px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: 'center',
              marginTop: "2rem",
            }}
          >
            {/* <AccountCircle style={{ fontSize: 80, color: '#e24c0e' }} /> */}
            <WorkIcon style={{ fontSize: 80, color: "#e24c0e" }} />

            <Typography variant="h4" component="h1" gutterBottom>
              登錄
            </Typography>
            <TextField
              label="電子郵件"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: "1rem" }}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="密码"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: "1rem" }}
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              style={{ backgroundColor: "#e24c0e" }}
            >
              登錄
            </Button>
            <Typography variant="body1" style={{ marginTop: "1rem" }}>
              <span style={{ color: "#888", fontWeight: "lighter" }}>
                加入蝦皮？
              </span>
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#e24c0e",
                  cursor: "pointer",
                }}
              >
                註冊
              </Link>
            </Typography>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
