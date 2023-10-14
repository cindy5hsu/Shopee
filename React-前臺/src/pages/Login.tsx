import React, { useState } from 'react';
import { Button, Container, TextField, Typography, Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { Link, useNavigate  } from "react-router-dom"; 
import axios from 'axios';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate(); 

const handleLogin = async () => {
  let isValid = true;

  if (!email) {
    setEmailError('電子邮件不能为空');
    isValid = false;
  } else {
    setEmailError('');
  }

  if (!password) {
    setPasswordError('密码不能为空');
    isValid = false;
  } else {
    setPasswordError('');
  }

  if (!isValid) {
    return; // 如果存在错误，不继续执行登录请求
  }

  try {
    // 执行登录请求
    const response = await axios.post('http://localhost:8080/users/login', {
      email: email,
      password: password,
    });

    console.log(response);

    sessionStorage.setItem('isloggin', 'true');
    sessionStorage.setItem('islogout', 'false');
    sessionStorage.setItem('userId', response.data.userId);

    navigate('/'); // 登录成功后，导航到主页
  } catch (error) {
    console.error('登入期間出現錯誤:', error);

    // 处理登录失败的情况，例如密码或账号错误
    setEmailError('電子郵件或密碼錯誤');
    setPasswordError('電子郵件或密碼錯誤');
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
      >        <AccountCircle style={{ fontSize: 80, color: '#e24c0e' }} />
        <Typography variant="h4" component="h1" gutterBottom >
             登錄
        </Typography>
        {/* <TextField
          label="信箱"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: '1rem' }}
        /> */}
        <TextField
          label="電子郵件"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: '1rem' }}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          label="密码"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '1rem' }}
          error={!!passwordError}
          helperText={passwordError}
        />
        <Button variant="contained" color="primary" onClick={handleLogin}
        style={{ backgroundColor: '#e24c0e' }}>
          登錄
        </Button>
        <Typography variant="body1" style={{ marginTop: '1rem' }}>
        <span style={{ color: '#888', fontWeight: 'lighter' }}>蝦皮新朋友？</span>
          <Link to="/register" style={{textDecoration: 'none', color: '#e24c0e', cursor: 'pointer'}}>
            註冊
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
