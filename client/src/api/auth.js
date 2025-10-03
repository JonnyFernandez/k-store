import axios from './axios';


export const registerRequest = async (user) => {
    let info = {
        email: user.email,
        password: user.password,
        name: user.name,
        type: user.type
    };
    // console.log(info);
    try {
        const res = await axios.post(`/register`, info);
        return res;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
};

export const loginRequest = async (user) => {
    console.log(user);


    try {
        const res = await axios.post(`/auth/login`, user);
        return res;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }


};
export const usersRequest = async () => {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.get(`/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }


};
export const verifyTokenRequest = () => {
    const token = localStorage.getItem("token");
    return axios.get("/verify", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
export const refreshTokenRequest = () => {
    const ref = localStorage.getItem("ref");
    return axios.get("/refresh", {
        headers: {
            Authorization: `Bearer ${ref}`
        }
    });
};


export const toggleStatusRequest = (id) => axios.put(`/user-status/${id}`);
export const deleteUserRequest = (id) => axios.delete(`/users/${id}`);
