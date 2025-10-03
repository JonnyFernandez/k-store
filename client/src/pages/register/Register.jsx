import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginStyle from '../login/Login.module.css'

const Register = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: registerErrors } = useAuth()


    const [secretPass, setSecretPass] = useState('')

    const pass = 'ruta55*2'




    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);



    const onSubmit = (values) => {

        if (pass !== secretPass)
            return alert("Comunicate con jhon GoodNight para que te registre")

        signup(values);


    };

    return (
        <div className={LoginStyle.login}>
            <div className={LoginStyle.loginContainer}>
                {/* Mensajes de error de registro */}
                {registerErrors?.length > 0 && (
                    <div className="mb-4">
                        {registerErrors.map((error, i) => (
                            <div key={i} className={LoginStyle.errorLogin}>{error}</div>
                        ))}
                    </div>
                )}

                <h1 className={LoginStyle.titleLogin}>Register</h1>

                <form onSubmit={handleSubmit(onSubmit)} className={LoginStyle.loginForm}>
                    {/* Campo de Nombre */}
                    <div>
                        <input
                            type="text"
                            {...register('name', { required: 'Name is required' })}
                            className="w-full p-2 border rounded"
                            placeholder="Name"
                            autoComplete="off"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Campo de Email */}
                    <div>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full p-2 border rounded"
                            placeholder="Email"
                            autoComplete="on"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Campo de Contraseña */}
                    <div>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className="w-full p-2 border rounded"
                            placeholder="Password"
                            autoComplete="off"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Campo de Tipo (Opcional) */}
                    <div>
                        <input
                            type="text"
                            {...register('type')}
                            className="w-full p-2 border rounded"
                            placeholder="Type (optional)"
                            autoComplete="off"
                        />
                    </div>
                    <div>
                        <input
                            type="text" required
                            className="w-full p-2 border rounded"
                            placeholder="codigo secreto"
                            autoComplete="off"
                            value={secretPass}
                            onChange={(e) => setSecretPass(e.target.value)}
                        />
                    </div>

                    {/* Botón de registro */}
                    <button type="submit" className={LoginStyle.submitButon}>
                        Register
                    </button>
                </form>

                <p className={LoginStyle.recomendation}>
                    Already have an account?{' '}
                    <Link className="" to="/">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
