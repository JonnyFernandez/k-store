import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import LoginStyle from './Login.module.css'

const Login = () => {

    // const auth = useAuth()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { signin, isAuthenticated, errors: signinErrors } = useAuth()


    useEffect(() => {
        if (isAuthenticated) navigate('/home')
    }, [isAuthenticated])



    const onSubmit = async (values) => {
        signin(values)
        // console.log(values);

    };
    return (
        <div className={LoginStyle.login} >
            <div className={LoginStyle.divTitle} > <b>Store</b> </div>
            <div className={LoginStyle.loginContainer}>
                {
                    signinErrors?.length >= 1 ? signinErrors?.map((item, i) => <div key={i} className={LoginStyle.errorLogin}>{item}</div>) : ''
                }
                <h1 className={LoginStyle.titleLogin}>Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className={LoginStyle.loginForm} >
                    <input
                        type='email'
                        {...register('email', { required: true })}
                        className=''
                        placeholder='email'
                    />
                    {errors.email && <p className=''>email is required</p>}
                    <input
                        type='password'
                        {...register('password', { required: true })}
                        className=''
                        placeholder='Password'
                    />
                    {errors.password && <p className=''>password is required</p>}


                    <button type='submit' className={LoginStyle.submitButon}>Login</button>
                </form>
                <p className={LoginStyle.recomendation}>Don´t have acount? <Link className='' to={'/register'}>Sign up</Link> </p>
            </div>

        </div>
    );
}

export default Login