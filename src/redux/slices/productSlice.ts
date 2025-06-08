import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import productService from '../../services/productService';
import type { Product, ProductResponse, CreateProductInput } from '../../services/productService';

export interface ProductState {
  products: Product[];
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  skip: number;
  limit: number;
}

const initialState: ProductState = {
  products: [],
  product: null,
  isLoading: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 10,
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params: { limit?: number; skip?: number }, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product details'
      );
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed'
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (product: CreateProductInput, { rejectWithValue }) => {
    try {
      const response = await productService.addProduct(product);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add product'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, update }: { id: number; update: Partial<Product> }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(id, update);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await productService.deleteProduct(id);
      return { ...response, id };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.limit = action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch product by id
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Add product
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.product?.id === action.payload.id) {
          state.product = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<{id: number, isDeleted: boolean}>) => {
        state.isLoading = false;
        if (action.payload.isDeleted) {
          state.products = state.products.filter(p => p.id !== action.payload.id);
          if (state.product?.id === action.payload.id) {
            state.product = null;
          }
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductError, clearProduct } = productSlice.actions;
export default productSlice.reducer;
