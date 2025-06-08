import React, { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Box,
    TextField,
    InputAdornment,
    Chip,
    Tooltip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchProducts, deleteProduct, searchProducts } from '../redux/slices/productSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';

const ProductsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { products, isLoading, total } = useAppSelector((state) => state.product);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchProducts({ limit: rowsPerPage, skip: page * rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (id: number) => {
        navigate(`/products/edit/${id}`);
    };

    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (productToDelete) {
            try {
                await dispatch(deleteProduct(productToDelete)).unwrap();
                // Refresh products after deletion
                dispatch(fetchProducts({ limit: rowsPerPage, skip: page * rowsPerPage }));
                // Show success notification if needed
            } catch (error) {
                console.error('Error deleting product:', error);
                // Handle error if needed
            } finally {
                setDeleteDialogOpen(false);
                setProductToDelete(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            dispatch(searchProducts(searchQuery));
        } else {
            dispatch(fetchProducts({ limit: rowsPerPage, skip: 0 }));
        }
        setPage(0);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleAddProduct = () => {
        navigate('/products/add');
    };

    const handleViewDetails = (id: number) => {
        navigate(`/products/${id}`);
    };

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Products</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddProduct}
                >
                    Add Product
                </Button>
            </Box>

            <Paper sx={{ mb: 2, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button onClick={handleSearch} disabled={isLoading}>
                                    Search
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <TableContainer component={Paper}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Brand</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Stock</TableCell>
                                    <TableCell align="right">Rating</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id} hover onClick={() => handleViewDetails(product.id)} style={{ cursor: 'pointer' }}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.title}</TableCell>
                                        <TableCell>{product.brand}</TableCell>
                                        <TableCell>
                                            <Chip label={product.category} size="small" />
                                        </TableCell>
                                        <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                                        <TableCell align="right">{product.stock}</TableCell>
                                        <TableCell align="right">{product.rating}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(product.id);
                                                    }}
                                                    size="small"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick(product.id);
                                                    }}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductsPage;
