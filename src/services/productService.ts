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
  isDeleted?: boolean;
  deletedOn?: string;
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
      // DummyJSON uses this endpoint for adding products
      const response = await api.post('/products/add', JSON.stringify(product), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (id: number, update: Partial<Product>) => {
    try {
      // DummyJSON requires data to be stringified and specific Content-Type
      const response = await api.put(`/products/${id}`, JSON.stringify(update), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      // DummyJSON delete endpoint
      const response = await api.delete(`/products/${id}`);
      console.log('Delete response:', response);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

export default productService;
