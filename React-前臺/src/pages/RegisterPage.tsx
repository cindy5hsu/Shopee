
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import { Container, Typography, TextField, Button, Box } from "@mui/material";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    let isValid = true;

    if (!email) {
      setEmailError("不能為空值");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("不能為空值");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!password || !confirmPassword) {
      setConfirmPasswordError("請輸入密碼和確認密碼");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("密碼不匹配");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }
    

    if (!isValid) {
      return;
    }

    const userData = {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    try {
      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // 注册成功，可以在这里处理成功的逻辑，例如重定向到登录页面
        console.log("User registered successfully");
        navigate("/Login");
      } else {
        // 注册失败，可以在这里处理失败的逻辑
        console.error("User registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <Container maxWidth="sm">

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
      <AccountCircle style={{ fontSize: 80, color: "#e24c0e" }} />
        <Typography variant="h4" gutterBottom>
          註冊賬號
        </Typography>
        <TextField
          label="電子郵件"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          label="密碼"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          error={!!passwordError}
          helperText={passwordError}
        />
        {/* 新增确认密码输入框 */}
        <TextField
          label="确认密碼"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 2 }}
          error={!!confirmPasswordError}
          helperText={confirmPasswordError}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          style={{ backgroundColor: "#e24c0e", width: "95%" }}
        >
          註冊
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
