import api from './api';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail?: string;
  images?: string[];
}

const productService = {
  getProducts: async (params?: { limit?: number; skip?: number; select?: string }) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id: number) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchProducts: async (query: string) => {
    try {
      const response = await api.get(`/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addProduct: async (product: CreateProductInput) => {
    try {
      const response = await api.post('/products/add', product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (id: number, update: Partial<Product>) => {
    try {
      const response = await api.put(`/products/${id}`, update);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default productService;
