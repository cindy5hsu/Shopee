import React, { useState } from 'react';
import {  useNavigate  } from "react-router-dom"; 
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate(); 

  const handleRegister = async () => {
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
    const userData = {
        email: email,
        password: password,
      };
  
      try {
        const response = await fetch('http://localhost:8080/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        if (response.ok) {
          // 注册成功，可以在这里处理成功的逻辑，例如重定向到登录页面
          console.log('User registered successfully');
          navigate('/');

        } else {
          // 注册失败，可以在这里处理失败的逻辑
          console.error('User registration failed');
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
  };

  return (
    <Container maxWidth="sm">
      <Box  sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh', // 使 Box 填滿整個視口高度
        }}>
        <Typography variant="h4" gutterBottom>
          註冊賬號
        </Typography>
        {/* <TextField
          label="用戶名"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        /> */}
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
        <Button variant="contained" color="primary" onClick={handleRegister}
        style={{ backgroundColor: '#e24c0e', width: '95%'}}>
          註冊
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
