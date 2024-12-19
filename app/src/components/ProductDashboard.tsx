import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  computeAverageProductPrice,
  formatPrice,
  getPriceRanges,
  getTopTags,
  Product,
} from "~/utils/product";

interface ProductDashboardProps {
  products: Product[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const ProductDashboard: React.FC<ProductDashboardProps> = ({ products }) => {
  const priceRangeData = React.useMemo(() => {
    return getPriceRanges(products);
  }, [products]);

  const tagData = React.useMemo(() => {
    return getTopTags(products, 5).map(([name, value], idx) => ({
      name,
      value,
      color: COLORS[idx % COLORS.length],
    }));
  }, [products]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Total Products
              </Typography>
              <Box>
                <Typography variant="h4" color="primary">
                  {products.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Average Price
              </Typography>
              <Box>
                <Typography variant="h4" color="primary">
                  {computeAverageProductPrice(products)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Under $500
              </Typography>
              <Box>
                <Typography variant="h4" color="primary">
                  {Math.round(
                    (products.filter((p) => p.price < 500).length /
                      products.length) *
                      100
                  )}
                  %
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of products
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Price Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={priceRangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Most Common Tags
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={tagData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {tagData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Products
        </Typography>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Net Price</TableCell>
                <TableCell>Tax Rate</TableCell>
                <TableCell align="right">Final Price</TableCell>
                <TableCell>Categories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products
                .sort((a, b) => (a.price > b.price ? 1 : -1))
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatPrice(product.net_price)}</TableCell>
                    <TableCell>{product.taxes}%</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          product.price < 500 ? "success.main" : "error.main",
                      }}
                    >
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {product.categories.slice(0, 3).map((cat, idx) => (
                          <Chip
                            key={idx}
                            label={cat.substring(0, 8)}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {product.categories.length > 3 && (
                          <Chip
                            label={`+${product.categories.length - 3}`}
                            size="small"
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ProductDashboard;
