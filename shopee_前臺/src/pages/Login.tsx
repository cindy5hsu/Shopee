import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { Link, useNavigate  } from "react-router-dom"; 
import axios from 'axios';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate(); // 使用 useNavigate hook 获取导航函数

const handleLogin = async () => {
  let isValid = true;

  if (!email) {
    setEmailError('不能為空值');
    isValid = false;
  } else {
    setEmailError('');
  }

  if (!password) {
    setPasswordError('不能為空值');
    isValid = false;
  } else {
    setPasswordError('');
  }
  try {
    // var response;
    await axios.post('http://localhost:8080/users/login', {
      email: email,
      password: password
    }).then( (res) => {
        console.log(res);
        sessionStorage.setItem('isloggin','true');
        sessionStorage.setItem('islogout','false');
        sessionStorage.setItem('userId',res.data.userId);
        // 登录成功后，导航到主页
        navigate('/');// 替换 '/homepage' 为你实际的主页路径
    })
      .catch( (error) => console.log(error))
  } catch (error) {
    console.error('Error during login:', error);
    // 在这里可以处理网络错误或其他异常
  }
};



  return (
    <Container maxWidth="sm">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
        <AccountCircle style={{ fontSize: 80, color: '#e24c0e' }} />
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
      </div>
    </Container>
  );
};

export default Login;
