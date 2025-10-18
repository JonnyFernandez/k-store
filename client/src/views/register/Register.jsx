import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { registerUser } from "../../api/product";
import styleRegister from "./Register.module.css";

const Register = () => {
    const navigate = useNavigate();
    const [secretPass, setSecretPass] = useState("");
    const pass = "ruta55";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (values) => {
        if (secretPass !== pass) {
            Swal.fire(
                "Código incorrecto",
                "Comunicate con Jhon GoodNight para que te registre 😎",
                "warning"
            );
            return;
        }

        try {
            await registerUser(values);
            Swal.fire({
                icon: "success",
                title: "¡Usuario registrado!",
                text: "Ya puedes iniciar sesión.",
                showConfirmButton: false,
                timer: 1500,
            });
            navigate("/");
        } catch (error) {
            console.error("❌ Error al registrar usuario:", error);
            Swal.fire("Error", "Ocurrió un error al registrar el usuario.", "error");
        }
    };

    return (
        <div className={styleRegister.container}>
            <form className={styleRegister.form} onSubmit={handleSubmit(onSubmit)}>
                <h2 className={styleRegister.title}>Crear cuenta</h2>

                <div className={styleRegister.formGroup}>
                    <label>Nombre</label>
                    <input
                        type="text"
                        {...register("name", { required: "El nombre es obligatorio" })}
                        placeholder="Ingrese su nombre completo"
                        autoComplete="off"
                    />
                    {errors.name && <p className={styleRegister.error}>{errors.name.message}</p>}
                </div>

                <div className={styleRegister.formGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        {...register("email", { required: "El email es obligatorio" })}
                        placeholder="Ingrese su correo electrónico"
                        autoComplete="on"
                    />
                    {errors.email && <p className={styleRegister.error}>{errors.email.message}</p>}
                </div>

                <div className={styleRegister.formGroup}>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        {...register("password", { required: "La contraseña es obligatoria" })}
                        placeholder="Ingrese su contraseña"
                        autoComplete="off"
                    />
                    {errors.password && (
                        <p className={styleRegister.error}>{errors.password.message}</p>
                    )}
                </div>

                <div className={styleRegister.formGroup}>
                    <label>Tipo de usuario</label>
                    <select
                        {...register("type", { required: "Selecciona un tipo de usuario" })}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Seleccione un tipo
                        </option>
                        <option value="admin">Admin</option>
                        <option value="seller">Seller</option>
                    </select>
                    {errors.type && <p className={styleRegister.error}>{errors.type.message}</p>}
                </div>

                <div className={styleRegister.formGroup}>
                    <label>Código secreto</label>
                    <input
                        type="text"
                        placeholder="Ingrese el código secreto"
                        required
                        value={secretPass}
                        onChange={(e) => setSecretPass(e.target.value)}
                        autoComplete="off"
                    />
                </div>

                <button type="submit" className={styleRegister.btnRegister}>
                    Registrarse
                </button>

                <p className={styleRegister.loginText}>
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/" className={styleRegister.loginLink}>
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
