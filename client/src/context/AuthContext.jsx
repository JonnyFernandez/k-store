import { createContext, useState, useContext, useEffect } from "react";

import { registerRequest, loginRequest, verifyTokenRequest, refreshTokenRequest, toggleStatusRequest, deleteUserRequest, usersRequest } from "../api/auth";
import Cookies from 'js-cookie';

export const AuthContext = createContext({}); // Cambiado a AuthContext

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [Loading, setLoading] = useState(true);




    const signup = async (values) => {

        try {
            const res = await registerRequest(values);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            setErrors(error.response?.data?.message || ["Unexpected error occurred"]);
        }
    };

    const signin = async (values) => {
        try {
            const res = await loginRequest(values);

            if (res.data.active === false) {
                setErrors(['Usuario pausado']);
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            // Guardar tokens en localStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("ref", res.data.refreshT);

            // Guardar el usuario en el contexto
            setUser(res.data);
            setIsAuthenticated(true);

        } catch (error) {
            if (Array.isArray(error.response?.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response?.data?.message || "Error desconocido"]);
        }
    };


    const get_AllUsers = async () => {
        // console.log(`Buscando todos los usuarios`);

        try {
            const res = await usersRequest();

            setUsers(res.data);

        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);



    useEffect(() => {
        async function checkLogin() {
            try {
                const res = await verifyTokenRequest();

                if (!res.data) {
                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                // Si el token expiró, intento refrescarlo
                const ref = localStorage.getItem("ref");
                if (!ref) {
                    // No hay refresh token, cerrar sesión
                    localStorage.removeItem("token");
                    localStorage.removeItem("ref");
                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                try {
                    const refreshRes = await refreshTokenRequest();

                    const newToken = refreshRes.data.token.token; // <-- tu backend devuelve solo el token nuevo


                    localStorage.setItem("token", newToken);

                    // Verificamos el nuevo token
                    const res = await verifyTokenRequest();
                    if (res.data) {
                        setIsAuthenticated(true);
                        setUser(res.data);
                    } else {
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                } catch (err) {
                    // El refresh token también expiró
                    localStorage.removeItem("token");
                    localStorage.removeItem("ref");
                    setIsAuthenticated(false);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            }
        }

        checkLogin();
    }, []);



    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("ref");

        setUser(null);             // si estás usando contexto de usuario
        setIsAuthenticated(false); // opcional, si manejás estado de sesión
    };


    const toggle_User_status = async (id) => {
        // console.log(`Buscando todos los usuarios`);

        try {
            await toggleStatusRequest(id);

        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };
    const remove_User = async (id) => {
        // console.log(`Buscando todos los usuarios`);

        try {
            await deleteUserRequest(id);

        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data);
            }
            setErrors([error.response.data.message]);
        }
    };

    return (
        <AuthContext.Provider value={{ logout, signup, signin, user, users, isAuthenticated, errors, Loading, get_AllUsers, toggle_User_status, remove_User }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext); // Cambiado a AuthContext
