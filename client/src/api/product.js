import axios from './axios';

// ---------------- Token ---------------------------
const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

// ---------------- Product ---------------------------
export const postProdRequest = async (data) =>
    axios.post(`/prod/`, data, getAuthHeader());

export const api_prod_details = async (id) =>
    axios.get(`/prod/${id}`, getAuthHeader());

export const api_prod_delete = async (id) =>
    axios.delete(`/prod/${id}`, getAuthHeader());

export const api_prod_detail_update = async (id, data) =>
    axios.put(`/prod/${id}`, data, getAuthHeader());

export const update_prod_status = async (id) =>
    axios.put(`/status/${id}`, {}, getAuthHeader());

export const prodEditRequest = async (id, data) =>
    axios.put(`/prod/${id}`, data, getAuthHeader());

export const api_featured_prod = async (id) =>
    axios.put(`/status-featured/${id}`, {}, getAuthHeader());

export const api_offer_prod = async (id) =>
    axios.put(`/offer-prod/${id}`, {}, getAuthHeader());

export const prodUpdateStockRequest = async (id, data) =>
    axios.put(`/prod/${id}`, data, getAuthHeader());

export const ProdRequest = async () =>
    axios.get(`/prod`); // pública, sin token

// ---------------- Distributor ---------------------------
export const api_delete_distributor = async (id) =>
    axios.delete(`/distributor/${id}`, getAuthHeader());

export const api_toggle_distributor_status = async (id) =>
    axios.put(`/distributor-update-status/${id}`, {}, getAuthHeader());

export const api_update_distributor_numbers = async (id, data) =>
    axios.put(`/distributor/${id}`, data, getAuthHeader());

export const api_get_all_distributors = async () =>
    axios.get(`/distributor/`); // pública

export const api_post_distributor = async (data) =>
    axios.post(`/distributor/`, data, getAuthHeader());

// ---------------- Category ---------------------------
export const api_create_category = async (data) =>
    axios.post(`/category/`, data, getAuthHeader());

export const api_get_all_categories = async () =>
    axios.get(`/category/`); // pública

export const api_delete_category = async (id) =>
    axios.delete(`/category/${id}`, getAuthHeader());

// ---------------- Orders ---------------------------
export const api_create_order = async (data) =>
    axios.post(`/order/`, data, getAuthHeader());

export const api_get_order = async (code = "") => {
    try {
        const query = code ? `?orderCode=${encodeURIComponent(code)}` : "";
        const response = await axios.get(`/order${query}`, getAuthHeader());
        return response.data
    } catch (error) {
        console.error("Error al obtener órdenes:", error.response?.data || error.message);
        throw error;
    }
};
export const api_get_order_by_cuit = async (cuit = "") => {
    try {
        const query = cuit ? `?cuit=${encodeURIComponent(cuit)}` : "";
        const response = await axios.get(`/order_by_cuit${query}`, getAuthHeader());
        return response.data
    } catch (error) {
        console.error("Error al obtener órdenes:", error.response?.data || error.message);
        throw error;
    }
};
export const api_get_order_by_username = async (username = "") => {
    try {
        const query = username ? `?clientname=${encodeURIComponent(username)}` : "";
        const response = await axios.get(`/order_by_clientname${query}`, getAuthHeader());
        return response.data


    } catch (error) {
        console.error("Error al obtener órdenes:", error.response?.data || error.message);
        throw error;
    }
};

export const api_order_by_id = async (id) =>
    axios.get(`/order/${id}`, getAuthHeader());

export const api_order_cancel = async (id) =>
    axios.put(`/order/${id}`, {}, getAuthHeader());

export const api_order_delete = async (id) =>
    axios.delete(`/order/${id}`, getAuthHeader());

export const api_order_update = async (id, data) =>
    axios.put(`/order-update/${id}`, data, getAuthHeader());

export const api_order_update_invoice = async (id) => {
    await axios.put(`/order-invoice/${id}`, null, getAuthHeader());

}


export const api_get_order_by_date = async (date1, date2) =>
    axios.get(`/report-order?startDate=${date1}&endDate=${date2}`, getAuthHeader());

// ----------------------------------------------------------






// ---------------- Stock Report ---------------------------
export const api_stock_report = async () =>
    axios.get(`/stock-report`, getAuthHeader());

// ---------------- Statistics ---------------------------
export const api_statistic = async (date1, date2) =>
    axios.get(`/sales-report?startDate=${date1}&endDate=${date2}`, getAuthHeader());

// ---------------- Massive Update ---------------------------
export const api_category_update_cost = async (id, data) =>
    axios.post(`/update-cost-category/${id}`, data, getAuthHeader());

export const api_distributor_update_cost = async (id, data) =>
    axios.post(`/update-cost-distributor/${id}`, data, getAuthHeader());
