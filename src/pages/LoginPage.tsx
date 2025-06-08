import React, { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { login, clearError } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

const defaultTheme = createTheme();

const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
});

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            dispatch(login(values));
        },
    });

    // Handler for demo login
    const handleDemoLogin = () => {
        formik.setValues({
            username: 'emilys',
            password: 'emilyspass'
        });
        // Submit the form after setting values
        setTimeout(() => {
            dispatch(login({ username: 'emilys', password: 'emilyspass' }));
        }, 100);
    };

    useEffect(() => {
        if (isAuthenticated) {
            console.log('User is authenticated, navigating to dashboard');
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        // Clear any errors when component mounts
        dispatch(clearError());
    }, [dispatch]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper
                    elevation={3}
                    sx={{
                        marginTop: 8,
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Alert severity="info" sx={{ width: '100%', mt: 2 }}>
                        Use the Demo Login button below for quick access
                    </Alert>
                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            onClick={handleDemoLogin}
                            disabled={isLoading}
                            sx={{ mb: 2 }}
                        >
                            Demo Login
                        </Button>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{ mt: 2 }}
                        >
                            Demo credentials: username: 'emilys', password: 'emilyspass'
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default LoginPage;
