import axios from './axios';

// !! Productos
export const getProducts = () => axios.get('/products');
export const getProductById = (id) => axios.get(`/products/${id}`);
export const createProduct = (data) => axios.post('/products', data);
export const updateProduct = (id, data) => axios.put(`/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`/products/${id}`);
export const getProductsByCategory = (category) => axios.get(`/products/category/${category}`);
// export const searchProducts = (query) => axios.get(`/products/search`, { params: { q: query } });


// !! Orders
export const getOrders = () => axios.get('/order');
export const getOrderById = (id) => axios.get(`/order/${id}`);
export const createOrder = (data) => axios.post('/order', data);
export const updateOrder = (id, data) => axios.put(`/order/${id}`, data);
export const deleteOrder = (id) => axios.delete(`/order/${id}`);
