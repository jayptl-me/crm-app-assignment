import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Paper,
    Button,
    Box,
    Card,
    CardMedia,
    Chip,
    CircularProgress,
    Divider,
    Rating,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    // Grid, // Removed Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchProductById, clearProduct } from '../redux/slices/productSlice';
import type { RootState } from '../redux/store';
import { Row, Col } from '../components/utils/GridFix'; // Added Row and Col

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { product, isLoading, error } = useAppSelector((state: RootState) => state.product);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(Number(id)));
        }

        // Cleanup function
        return () => {
            dispatch(clearProduct());
        };
    }, [dispatch, id]);

    const handleBack = () => {
        navigate('/products');
    };

    const handleEdit = () => {
        if (id) {
            navigate(`/products/edit/${id}`);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography color="error" variant="h6">Error: {error}</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
                    Back to Products
                </Button>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Product not found</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
                    Back to Products
                </Button>
            </Box>
        );
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
                    Back to Products
                </Button>
                <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
                    Edit Product
                </Button>
            </Box>

            <Row>
                <Col xs={12} md={5}>
                    <Card>
                        <CardMedia
                            component="img"
                            image={product.thumbnail}
                            alt={product.title}
                            sx={{ height: 300, objectFit: 'contain', bgcolor: '#f5f5f5' }}
                        />
                    </Card>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Product Images</Typography>
                        <Row>
                            {product.images.map((image: string, index: number) => (
                                <Col xs={4} key={index}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            image={image}
                                            alt={`${product.title} - image ${index + 1}`}
                                            sx={{ height: 100, objectFit: 'cover' }}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Box>
                </Col>

                <Col xs={12} md={7}>
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h4" gutterBottom>
                                {product.title}
                            </Typography>
                            <Chip
                                label={product.category}
                                color="primary"
                                variant="outlined"
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={product.rating} precision={0.1} readOnly />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                                ({product.rating})
                            </Typography>
                        </Box>

                        <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                            ${product.price.toFixed(2)}
                            {product.discountPercentage > 0 && (
                                <Typography component="span" variant="body1" sx={{ ml: 1, color: 'text.secondary', textDecoration: 'line-through' }}>
                                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                                </Typography>
                            )}
                        </Typography>

                        {product.discountPercentage > 0 && (
                            <Chip
                                label={`${product.discountPercentage}% OFF`}
                                color="error"
                                size="small"
                                sx={{ mb: 2 }}
                            />
                        )}

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body1" paragraph>
                            {product.description}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Brand</TableCell>
                                        <TableCell>{product.brand}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Category</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Stock</TableCell>
                                        <TableCell>{product.stock} units</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">ID</TableCell>
                                        <TableCell>{product.id}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetailPage;
