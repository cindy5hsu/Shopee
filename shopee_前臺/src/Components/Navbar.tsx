import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link } from "react-router-dom"; 
import { useEffect, useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useLocation } from 'react-router-dom'; // 导入 useLocation Hook
import { CartContext  } from '../Context/CartContext';



// import { alpha, AppBar, Badge, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import './HomePage'
import './Navbar.css';

const FlashWrapper = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white; /* Choose the color you want for the flash effect */
  opacity: 0; /* Initially, the wrapper is transparent */
  pointer-events: none; /* Prevents the wrapper from blocking user interaction */
  transition: opacity 0.5s ease; /* Adjust the duration and easing as needed */
`;


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  flex: 1, // 设置搜索框占据剩余的空间
  cursor: 'pointer', // 添加指针样式以指示可点击

  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));



export  function PrimarySearchAppBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const location = useLocation(); // 使用 useLocation 获取当前路由路径
  const [filteredResults, setFilteredResults] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
    const Loggin = sessionStorage.getItem('isloggin');
    const Logout = sessionStorage.getItem('islogout');
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  
    
    // const filterProductsByKeyword = (keyword) => {
    //     return products.filter((product) =>
    //       product.productName.toLowerCase().includes(keyword.toLowerCase())
    //     );
    //   };
    
    //   useEffect(() => {
    //     // 在路径匹配时执行搜索逻辑
    //     if (location.pathname === '/') {
    //       // 获取并使用 searchKeyword 进行产品过滤
    //       const filteredProducts = filterProductsByKeyword(searchKeyword);
    //       // 更新过滤结果或执行其他操作
    //       setFilteredResults(filteredProducts);
    //     }
    //   }, [location.pathname, searchKeyword]);
    
    const cartContext = React.useContext(CartContext);

    if (!cartContext) {
    throw new Error('CartContext value is undefined');
    }

    const { cart, addToCart } = cartContext;

    const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (cart) {
      setCartItemCount(cart.length);
    }
  }, [cart]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogin = () => {
    // 在登录成功后调用此函数，并将 isLoggedIn 设置为 true
    
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // 在注销时调用此函数，并将 isLoggedIn 设置为 false
    
    // sessionStorage.removeItem('isloggin');

    // setIsLoggedIn(false);
    // Set isLoggingOut to trigger the flash effect
    setIsLoggingOut(true);

    // Simulate a delay for the flash effect
    setTimeout(() => {
      sessionStorage.removeItem('isloggin');
      setIsLoggedIn(false);
      setIsLoggingOut(false);
    }, 100); // Adjust the duration as needed
  };
  
   // Add useEffect to reset isLoggingOut after the flash effect is complete
   useEffect(() => {
    if (isLoggingOut) {
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 1000); // Adjust the duration to match the CSS transition duration
    }
  }, [isLoggingOut]);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Order</MenuItem>
      <MenuItem onClick={handleMenuClose} component={Link} to="/pers">Profile</MenuItem>

      {/* <MenuItem onClick={handleMenuClose}  component={Link} to="/Login">Login</MenuItem>
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem> */}
       {Loggin ? (
      <MenuItem onClick={handleLogout}> 
      Logout</MenuItem>
    ) : (
      <MenuItem onClick={handleLogin} component={Link} to="/Login">
        Login
      </MenuItem>
    )}

    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
     

        <IconButton size="large"  color="inherit" 
         component={Link}
         to="/cart"
         onClick={handleMenuClose} // 关闭菜单
         >
          <Badge badgeContent={cart.length} color="error">
            {/* <MailIcon /> */}
            <ShoppingCartIcon />
            <span>{cart.length}</span>
          </Badge>
        </IconButton>

        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );


  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#e24c0e' }}>
        <Toolbar  >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          {/* <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </Typography> */}
            <Link to="/">
          <img
            src="data:image/jpeg;base64,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"
            alt="Shopee Logo"
            width="50"
            height="50"
          />
          </Link>
          <Search sx={{ flex: 2, justifyContent: 'center'}}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </Search>
                <FlashWrapper className={isLoggingOut ? 'flash' : ''} />

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {/* <Link to="/cart" style={{ textDecoration: 'none' }}> */}

            {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit"
            component={Link} // 使用 component 属性添加链接
            to="/cart" // 设置链接的目标路径
            style={{ textDecoration: 'none' }} // 移除下划线样式
            onClick={() => console.log('Clicked on Cart Icon')}
             >
              <Badge badgeContent={cart.length}  color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>      */}

<IconButton 
        size="large" 
        aria-label="show 4 new mails" 
        color="inherit"
        component={Link} 
        to="/cart" 
        style={{ textDecoration: 'none' }} 
        onClick={() => console.log('Clicked on Cart Icon')}
      >
        <Badge badgeContent={cartItemCount} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
                       {/* <MailIcon /> */}

            {/* </Link> */}

            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <ul>
        {filteredResults.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
export default PrimarySearchAppBar;
