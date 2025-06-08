import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchProductById, addProduct, updateProduct } from '../redux/slices/productSlice';
import type { CreateProductInput, Product } from '../services/productService';
import type { RootState } from '../redux/store';
import { Row, Col } from '../components/utils/GridFix';

const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    price: yup.number().positive('Price must be positive').required('Price is required'),
    discountPercentage: yup.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%').required('Discount percentage is required'),
    stock: yup.number().integer('Stock must be an integer').min(0, 'Stock cannot be negative').required('Stock is required'),
    brand: yup.string().required('Brand is required'),
    category: yup.string().required('Category is required'),
    thumbnail: yup.string().url('Must be a valid URL').required('Thumbnail URL is required'),
});

const categories = [
    'beauty', 'fragrances', 'furniture', 'groceries',
    'home-decoration', 'kitchen-accessories', 'laptops',
    'mens-shirts', 'mens-shoes', 'mens-watches',
    'mobile-accessories', 'motorcycle', 'skin-care',
    'smartphones', 'sports-accessories', 'sunglasses',
    'tablets', 'tops', 'vehicle', 'womens-bags',
    'womens-dresses', 'womens-jewellery', 'womens-shoes',
    'womens-watches'
];

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { product, isLoading, error } = useAppSelector((state: RootState) => state.product as {
        product: Product | null;
        isLoading: boolean;
        error: string | null;
    });
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchProductById(Number(id)));
        }
    }, [dispatch, id, isEditMode]);

    const formik = useFormik({
        initialValues: {
            title: product?.title || '',
            description: product?.description || '',
            price: product?.price || 0,
            discountPercentage: product?.discountPercentage || 0,
            rating: product?.rating || 0,
            stock: product?.stock || 0,
            brand: product?.brand || '',
            category: product?.category || '',
            thumbnail: product?.thumbnail || '',
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // Format the data to match DummyJSON API expectations
            const productData: CreateProductInput = {
                ...values,
                price: Number(values.price),
                stock: Number(values.stock),
                discountPercentage: Number(values.discountPercentage),
                // Ensure we have an array of images (even if empty)
                images: product?.images || []
            };

            try {
                if (isEditMode && id) {
                    await dispatch(updateProduct({ id: Number(id), update: productData })).unwrap();
                    console.log('Product updated successfully');
                    navigate(`/products/${id}`);
                } else {
                    const result = await dispatch(addProduct(productData)).unwrap();
                    console.log('Product added successfully:', result);
                    navigate(`/products/${result.id}`);
                }
            } catch (err) {
                console.error('Failed to save product:', err);
                // You could add a notification system here
            }
        },
    });

    if (isEditMode && isLoading && !product) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" component="h1" gutterBottom>
                {isEditMode ? 'Edit Product' : 'Add New Product'}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit}>
                <Row>
                    <Col xs={12}>
                        <TextField
                            fullWidth
                            id="title"
                            name="title"
                            label="Title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Col>

                    <Col xs={12}>
                        <TextField
                            fullWidth
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Col>

                    <Col xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="price"
                            name="price"
                            label="Price"
                            type="number"
                            InputProps={{
                                startAdornment: <span style={{ marginRight: 8 }}>$</span>
                            }}
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />
                    </Col>

                    <Col xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="discountPercentage"
                            name="discountPercentage"
                            label="Discount Percentage"
                            type="number"
                            InputProps={{
                                endAdornment: <span style={{ marginLeft: 8 }}>%</span>
                            }}
                            value={formik.values.discountPercentage}
                            onChange={formik.handleChange}
                            error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                            helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                        />
                    </Col>

                    <Col xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="stock"
                            name="stock"
                            label="Stock"
                            type="number"
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            error={formik.touched.stock && Boolean(formik.errors.stock)}
                            helperText={formik.touched.stock && formik.errors.stock}
                        />
                    </Col>

                    <Col xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="brand"
                            name="brand"
                            label="Brand"
                            value={formik.values.brand}
                            onChange={formik.handleChange}
                            error={formik.touched.brand && Boolean(formik.errors.brand)}
                            helperText={formik.touched.brand && formik.errors.brand}
                        />
                    </Col>

                    <Col xs={12}>
                        <TextField
                            fullWidth
                            id="category"
                            name="category"
                            select
                            label="Category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={formik.touched.category && formik.errors.category}
                        >
                            {categories.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Col>

                    <Col xs={12}>
                        <TextField
                            fullWidth
                            id="thumbnail"
                            name="thumbnail"
                            label="Thumbnail URL"
                            value={formik.values.thumbnail}
                            onChange={formik.handleChange}
                            error={formik.touched.thumbnail && Boolean(formik.errors.thumbnail)}
                            helperText={formik.touched.thumbnail && formik.errors.thumbnail}
                        />
                    </Col>

                    <Col xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/products')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : isEditMode ? 'Update Product' : 'Add Product'}
                        </Button>
                    </Col>
                </Row>
            </Box>
        </Paper>
    );
};

export default ProductForm;
