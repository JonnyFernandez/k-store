import axios from './axios';

// !! Productos
// http://localhost:3001/api/products?name=jabon
export const getProducts = () => axios.get('/products');// !hecho
export const getProductslowStock = () => axios.get('/products/low-stock');// !hecho
export const getProductSearch = (data) => axios.get(`/products?name=${data}`);// !hecho
export const getProductById = (id) => axios.get(`/product/${id}`);//
export const createProduct = (data) => axios.post('/products', data); // !hecho
export const updateProduct = (id, data) => axios.put(`/product/${id}`, data); // !hecho
export const deleteProduct = (id) => axios.delete(`/product/${id}`);
export const getProductsByCategory = (category) => axios.get(`/products/category/${category}`);
// export const searchProducts = (query) => axios.get(`/products/search`, { params: { q: query } });


// !! Orders
export const getOrders = () => axios.get('/order');
export const getOrderById = (id) => axios.get(`/order/${id}`); // !hecho
export const createOrder = (data) => axios.post('/order', data); // !hecho
export const updateOrder = (id, data) => axios.put(`/order/${id}`, data);
export const deleteOrder = (id) => axios.delete(`/order/${id}`);

// !! Categories
export const getCategory = async () => await axios.get('/category'); // !hecho
export const createCategory = async (data) => await axios.post('/category', data); // !hecho
export const deleteCategory = async (id) => await axios.delete(`/category/${id}`); // !hecho
export const updateCategoryProfits = async (id) => await axios.put(`/category/${id}/update-profits`);

// !! Provider
export const getProvider = async () => await axios.get('/provider');// !hecho
export const createProvider = async (data) => await axios.post('/provider', data); // !hecho
export const updateProvider = async (id, data) => await axios.put(`/provider/${id}`, data);
export const deleteProvider = async (id) => await axios.delete(`/provider/${id}`); // !hecho

// !! Stats
export const getStatistics = (date1, date2) => axios.get(`/stats/${date1}/to/${date2}`); // !hecho
export const getReportOrders = (date1, date2) => axios.get(`/report/${date1}/to/${date2}`); // !hecho
export const getReportStock = () => axios.get('/report-stock'); // !hecho

// !! Users
export const getUsers = () => axios.get('/auth/users');
export const registerUser = (data) => axios.post('/auth/register', data);
export const loginUser = (data) => axios.post('/auth/login', data);