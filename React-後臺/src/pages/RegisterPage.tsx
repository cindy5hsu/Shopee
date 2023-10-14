import React, { useState } from 'react';
import {  useNavigate  } from "react-router-dom"; 
import WorkIcon from "@mui/icons-material/Work";
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
  const [jobtitle, setJobtitle] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [confirmPasswordError, setConfirmPasswordError] = useState(''); 

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [jobtitleError, setJobtitleError] = useState('');
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
    
    if (!password || !confirmPassword) {
      setConfirmPasswordError("請輸入密碼和確認密碼");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("密碼不匹配");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }
    if (!jobtitle) {
      setJobtitleError("職位不能為空");
      isValid = false;
    } else {
      setJobtitleError("");
    }

    if (!isValid) {
      return;
    }

    const employeeData = {
        email: email,
        password: password,
        jobtitle: jobtitle,
        confirmPassword: confirmPassword,

      };
  
      try {
        const response = await fetch('http://localhost:8080/employee/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeeData),
        });
  
        if (response.ok) {
          // 注册成功，可以在这里处理成功的逻辑，例如重定向到登录页面
          console.log('employee registered successfully');
          navigate('/');

        } else {
          // 注册失败，可以在这里处理失败的逻辑
          console.error('employee registration failed');
        }
      } catch (error) {
        console.error('Error registering employee:', error);
      }
  };

  return (
    <Container maxWidth="sm">
      <Box  sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh', 
        }}>
        <WorkIcon style={{ fontSize: 80, color: "#e24c0e" }} />

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
         <TextField
          label="職位"
          fullWidth
          value={jobtitle}
          onChange={(e) => setJobtitle(e.target.value)}
          sx={{ mb: 2 }}
          error={!!jobtitleError}
        helperText={jobtitleError}
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
