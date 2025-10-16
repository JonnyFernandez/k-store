import { useEffect, useState } from 'react';
import styleU from './Users.module.css';
import { deleteUser, getUsers, registerUser } from '../../api/product';
import { Nav } from '../../components';
import Swal from 'sweetalert2';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        type: ''
    });
    // const [count, setCount] = useState(0)

    // 🔹 Traer usuarios al montar el componente
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        }
    };

    // 🔹 Manejador de cambios de formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 🔹 Registro de nuevo usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.type) {
            Swal.fire('Atención', 'Por favor complete todos los campos', 'warning');
            return;
        }

        try {
            await registerUser(formData);
            Swal.fire({
                icon: 'success',
                title: '✅ Usuario registrado correctamente',
                timer: 1500,
                showConfirmButton: false
            });
            setFormData({ name: '', email: '', password: '', type: '' });
            fetchUsers();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            // Confirmación antes de eliminar
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción eliminará al usuario permanentemente.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (!result.isConfirmed) return; // si cancela, no hace nada

            // Llamada al backend
            const res = await deleteUser(id);

            if (res.status === 200 || res.status === 204) {
                Swal.fire({
                    icon: "success",
                    title: "Usuario eliminado",
                    text: "El usuario fue eliminado correctamente.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                // Si querés actualizar la lista después:
                setUsers(users.filter(user => user.id !== id));
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar el usuario.",
            });
        }
    };

    return (
        <div>
            <Nav />
            <div className={styleU.usersContainer}>
                <h1>Gestión de usuarios</h1>

                {/* Formulario para registrar nuevo usuario */}
                <div className={styleU.formContainer}>
                    <h2>Registrar nuevo usuario</h2>
                    <form onSubmit={handleSubmit} className={styleU.userForm}>
                        <div className={styleU.formGroup}>
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ingrese nombre"
                            />
                        </div>

                        <div className={styleU.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ingrese email"
                            />
                        </div>

                        <div className={styleU.formGroup}>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Ingrese contraseña"
                            />
                        </div>

                        <div className={styleU.formGroup}>
                            <label>Tipo de usuario</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="">Seleccionar tipo</option>
                                <option value="admin">Administrador</option>
                                <option value="seller">Vendedor</option>
                                <option value="customer">Cliente</option>
                            </select>
                        </div>

                        <button type="submit" className={styleU.btnAdd}>Registrar</button>
                    </form>
                </div>

                {/* Listado de usuarios */}
                <div className={styleU.listContainer}>
                    <h2>Usuarios registrados</h2>

                    {users.length > 0 ? (
                        <table className={styleU.userTable}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Tipo</th>
                                    <th>Activo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.type}</td>
                                        <td>{user.active ? '✅' : '❌'}</td>
                                        <td>
                                            <button className={styleU.btnEdit}>Editar</button>
                                            <button className={styleU.btnDelete} onClick={() => handleDelete(user.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay usuarios registrados.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;
