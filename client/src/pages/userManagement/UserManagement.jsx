import styleUser from './UserManagement.module.css'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'

const UserManagement = () => {
    const { users, get_AllUsers, toggle_User_status, remove_User } = useAuth()
    const [loading, setLoading] = useState(true)




    const fetchUsers = async () => {
        try {
            await get_AllUsers()
        } catch (error) {
            console.error("Error al obtener usuarios:", error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [])

    const handleToggleStatus = async (userId) => {
        const aux = users.find(item => item.id === userId)
        if (aux.type === 'admin') {
            return alert('Los admini no deber ser pausados')
        }

        await toggle_User_status(userId)
        fetchUsers()
    }

    const handleRemoveUser = async (userId) => {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            await remove_User(userId)
        }
        fetchUsers()
    }

    if (loading) return <p>Cargando usuarios...</p>
    if (!users || users.length === 0) return <p>No hay usuarios disponibles.</p>

    return (
        <div className={styleUser.container}>
            <h2>Administración de Usuarios</h2>
            <table className={styleUser.table}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Ultima Conexion</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.type}</td>
                            <td>{user.active ? "Activo" : "Inactivo"}</td>
                            <td>
                                {user.lastLogin
                                    ? new Date(user.lastLogin).toLocaleString("es-AR", {
                                        timeZone: "America/Argentina/Buenos_Aires",
                                    })
                                    : "Sin conexión"}
                            </td>
                            <td>
                                <button
                                    onClick={() => handleToggleStatus(user.id)}
                                    className={styleUser.toggleBtn}
                                >
                                    {user.active ? "Desactivar" : "Activar"}
                                </button>
                                <button
                                    onClick={() => handleRemoveUser(user.id)}
                                    className={styleUser.deleteBtn}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserManagement
