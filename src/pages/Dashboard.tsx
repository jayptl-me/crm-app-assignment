import React, { useEffect, useState } from 'react';
import { Typography, Paper, Card, CardContent, Box } from '@mui/material'; // Removed Grid
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchProducts } from '../redux/slices/productSlice';
import type { ProductState } from '../redux/slices/productSlice';
import type { RootState } from '../redux/store';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import CircularProgress from '@mui/material/CircularProgress';
import InventoryIcon from '@mui/icons-material/Inventory';
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import type { Product } from '../services/productService';
import { Row, Col } from '../components/utils/GridFix'; // Added Row and Col

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, isLoading } = useAppSelector((state: RootState) => state.product as ProductState);
    const { user } = useAppSelector((state: RootState) => state.auth);
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
    const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
    const [stockByBrand, setStockByBrand] = useState<Record<string, number>>({});

    useEffect(() => {
        dispatch(fetchProducts({ limit: 100 }));
    }, [dispatch]);

    useEffect(() => {
        if (products.length > 0) {
            // Count products by category
            const categoryData: Record<string, number> = {};
            // Sum stock by brand
            const brandData: Record<string, number> = {};

            products.forEach((product: Product) => {
                // Category count
                categoryData[product.category] = (categoryData[product.category] || 0) + 1;

                // Stock by brand
                brandData[product.brand] = (brandData[product.brand] || 0) + product.stock;
            });

            setCategoryCounts(categoryData);
            setStockByBrand(brandData);

            // Get top rated products
            const sortedByRating = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);
            setTopRatedProducts(sortedByRating);
        }
    }, [products]);

    const categoryChartData = {
        labels: Object.keys(categoryCounts),
        datasets: [
            {
                label: 'Number of Products',
                data: Object.values(categoryCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const brandStockChartData = {
        labels: Object.keys(stockByBrand).slice(0, 10), // Limit to top 10 brands
        datasets: [
            {
                label: 'Stock by Brand',
                data: Object.entries(stockByBrand)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(item => item[1]),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const topRatedChartData = {
        labels: topRatedProducts.map(p => p.title.substring(0, 15) + '...'),
        datasets: [
            {
                label: 'Rating',
                data: topRatedProducts.map(p => p.rating),
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Calculate summary statistics
    const totalProducts = products.length;
    const averagePrice = products.length
        ? products.reduce((sum: number, product: Product) => sum + product.price, 0) / products.length
        : 0;
    const averageRating = products.length
        ? products.reduce((sum: number, product: Product) => sum + product.rating, 0) / products.length
        : 0;

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Dashboard
                </Typography>
                <Typography variant="subtitle1">
                    Welcome back, {user?.firstName} {user?.lastName}!
                </Typography>
            </Box>

            {/* Summary Cards */}
            <Row sx={{ mb: 4 }}>
                <Col xs={12} sm={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <InventoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                            <Box>
                                <Typography variant="h5">{totalProducts}</Typography>
                                <Typography variant="body2" color="text.secondary">Total Products</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Col>

                <Col xs={12} sm={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <AttachMoneyIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
                            <Box>
                                <Typography variant="h5">${averagePrice.toFixed(2)}</Typography>
                                <Typography variant="body2" color="text.secondary">Average Price</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Col>

                <Col xs={12} sm={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon sx={{ fontSize: 40, mr: 2, color: 'warning.main' }} />
                            <Box>
                                <Typography variant="h5">{averageRating.toFixed(1)}</Typography>
                                <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row>
                <Col xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Products by Category</Typography>
                        <Box height={300}>
                            <Pie data={categoryChartData} options={{ maintainAspectRatio: false }} />
                        </Box>
                    </Paper>
                </Col>

                <Col xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Top Rated Products</Typography>
                        <Box height={300}>
                            <Bar
                                data={topRatedChartData}
                                options={{
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 5
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </Col>

                <Col xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Inventory by Brand</Typography>
                        <Box height={300}>
                            <Line
                                data={brandStockChartData}
                                options={{
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
