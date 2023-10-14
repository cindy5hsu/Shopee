import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { Link } from "react-router-dom";
import { useSearch } from "@/Context/SearchContext";
import axios from "axios";

const HomePage: React.FC = () => {
  const { searchResults } = useSearch();
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [searchInput, setSearchInput] = useState("");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    if (searchResults) {
      const filteredProducts = products.filter((product) =>
        product.productName.toLowerCase().includes(searchResults.toLowerCase())
      );
      setProducts(filteredProducts);
    } else {
      axios.get("http://localhost:8080/products").then((response) => {
        setProducts(response.data.result);
      });
    }
  }, [searchResults, products]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.productName.toLowerCase().includes(searchInput.toLowerCase()) ||
      product.category.toLowerCase().includes(searchInput.toLowerCase())
    );
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <Grid container spacing={2}>
        {currentProducts.map((filteredProduct, index) => (
          <Grid
            item
            key={filteredProduct.productId}
            xs={12}
            sm={6}
            md={4}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <Link
              to={"/sp/" + filteredProduct.productId}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  border: hoveredCard === index ? "2px solid #e24c0e" : "none",
                  transform:
                    hoveredCard === index ? "translateY(-5px)" : "none",
                }}
              >
                <CardMedia
                  component="img"
                  height="300px"
                  image={filteredProduct.imageUrl}
                  alt={filteredProduct.productName}
                />
                <CardContent>
                  <Typography variant="h6">
                    {filteredProduct.productName}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {filteredProduct.categoryName}
                  </Typography>
                  <Typography variant="body1">
                    價格: ${filteredProduct.price}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Stack
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ marginTop: "20px" }}
      >
        <Pagination
          count={Math.ceil(filteredProducts.length / productsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="standard"
          sx={{
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#e24c0e",
              color: "#fff",
            },
          }}
        />
      </Stack>
    </Container>
  );
};

export default HomePage;
