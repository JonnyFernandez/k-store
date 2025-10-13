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

// !! Categories
export const getCategory = async () => await axios.get('/category');
export const createCategory = async (data) => await axios.post('/category', data);
export const deleteCategory = async (id) => await axios.delete(`/category/${id}`);
export const updateCategoryProfits = async (id) => await axios.put(`/category/${id}/update-profits`);

// !! Provider
export const getProvider = async () => await axios.get('/provider');
export const createProvider = async (data) => await axios.post('/provider', data);
export const updateProvider = async (id, data) => await axios.put(`/provider/${id}`, data);
export const deleteProvider = async (id) => await axios.delete(`/provider/${id}`);