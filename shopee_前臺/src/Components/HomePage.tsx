import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Link } from "react-router-dom"; 


interface Product {
  productId: number;
  productName: string;
  category: string;
  imageUrl: string;
  price: number;
  stock: number;
  description: string;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8080/products')
      .then(response => {
        setProducts(response.data.result);
        console.log(response);
      })
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  

  return (
    <Container  style={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        {currentProducts.map((product, index) => (
          <Grid item key={product.productId} xs={12} sm={6} md={4} 
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}>
              <Link to={"/sp/"+product.productId} style={{ textDecoration: 'none' }}>
            <Card
            sx={{
                border: hoveredCard === index ? '2px solid #e24c0e' : 'none',
                transform: hoveredCard === index ? 'translateY(-5px)' : 'none',
            }}
              >
              <CardMedia
                component="img"
                height="300px"
                width="250px"
                image={product.imageUrl}
                alt={product.productName}
                />
              <CardContent>
                <Typography variant="h6">{product.productName}</Typography>
                <Typography variant="subtitle1" color="textSecondary">{product.category}</Typography>
                <Typography variant="body1">Price: ${product.price}</Typography>
                <Typography variant="body1">Stock: {product.stock} units</Typography>
                
              </CardContent>
            </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Stack spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: '20px' }}>
        <Pagination
          count={Math.ceil(products.length / productsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="standard"
          sx={{ '& .MuiPaginationItem-page.Mui-selected': { backgroundColor: '#e24c0e', color: '#fff' } }}
        />
      </Stack>
    </Container>
  );
};

export default HomePage;
