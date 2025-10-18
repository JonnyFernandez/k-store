import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import styleLogin from "./Login.module.css";
import { loginUser } from "../../api/product";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    // Verificar usuario logueado
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) navigate("/home");
    }, [navigate]);

    // Manejo de inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;
        if (!email || !password) {
            Swal.fire("⚠️ Campos incompletos", "Por favor, complete todos los campos.", "warning");
            return;
        }

        try {
            const response = await loginUser(formData);
            if (response?.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
                Swal.fire({
                    icon: "success",
                    title: "¡Bienvenido!",
                    text: `Hola ${response.data.name || ""}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
                navigate("/home");
            }
        } catch (error) {
            console.error("❌ Error al iniciar sesión:", error);
            Swal.fire("Error", "Email o contraseña incorrectos.", "error");
        }
    };

    return (
        <div className={styleLogin.container}>
            <form className={styleLogin.form} onSubmit={handleSubmit}>
                <h2 className={styleLogin.title}>Iniciar Sesión</h2>

                <div className={styleLogin.formGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Ingrese su email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className={styleLogin.formGroup}>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Ingrese su contraseña"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className={styleLogin.btnLogin}>
                    Ingresar
                </button>

                <p className={styleLogin.registerText}>
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className={styleLogin.registerLink}>
                        Crear cuenta
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
