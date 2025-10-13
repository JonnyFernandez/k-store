import React, { useState, useEffect } from "react";
import styleD from "./Distribuitor.module.css";
import { Nav } from "../../components";
import { createProvider, getProvider, deleteProvider } from "../../api/product";

const Distribuitor = () => {
    const [providers, setProviders] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        phone1: "",
        phone2: "",
        phone3: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // 🔹 Obtener proveedores
    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const { data } = await getProvider();
            setProviders(data);
        } catch (error) {
            console.error("Error al obtener proveedores:", error);
        }
    };

    // 🔹 Manejar inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // 🔹 Crear proveedor
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, address, phone1 } = form;

        if (!name || !email || !address || !phone1)
            return alert("Los campos obligatorios deben completarse");

        try {
            setIsLoading(true);
            const { data } = await createProvider(form);
            setProviders([...providers, data]);
            setForm({
                name: "",
                email: "",
                address: "",
                phone1: "",
                phone2: "",
                phone3: "",
            });
        } catch (error) {
            console.error("Error al crear proveedor:", error);
            alert("No se pudo crear el proveedor");
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Eliminar proveedor
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
        try {
            await deleteProvider(id);
            setProviders(providers.filter((prov) => prov.id !== id));
        } catch (error) {
            console.error("Error al eliminar proveedor:", error);
            alert("No se pudo eliminar el proveedor");
        }
    };

    // 🔹 Actualizar productos de un proveedor
    const handleUpdateProducts = async (providerId) => {
        if (
            !window.confirm("¿Actualizar los productos que pertenecen a este proveedor?")
        )
            return;
        try {
            setIsUpdating(true);
            // await axios.put(`${API_URL}/${providerId}/update-products`);
            alert("Productos actualizados correctamente");
        } catch (error) {
            console.error("Error al actualizar productos:", error);
            alert("No se pudieron actualizar los productos");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className={styleD.pageWrapper}>
            <Nav />

            <div className={styleD.providerContainer}>
                <h2>Gestión de Proveedores</h2>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className={styleD.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre del proveedor"
                        value={form.name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Dirección"
                        value={form.address}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone1"
                        placeholder="Teléfono principal"
                        value={form.phone1}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone2"
                        placeholder="Teléfono secundario (opcional)"
                        value={form.phone2}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="phone3"
                        placeholder="Teléfono adicional (opcional)"
                        value={form.phone3}
                        onChange={handleChange}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Agregar Proveedor"}
                    </button>
                </form>

                {/* Listado de proveedores */}
                <div className={styleD.cardsGrid}>
                    {providers.map((prov) => (
                        <div key={prov.id} className={styleD.card}>
                            <h3>{prov.name}</h3>
                            <p><strong>Email:</strong> {prov.email}</p>
                            <p><strong>Dirección:</strong> {prov.address}</p>
                            <p><strong>Tel 1:</strong> {prov.phone1}</p>
                            {prov.phone2 && <p><strong>Tel 2:</strong> {prov.phone2}</p>}
                            {prov.phone3 && <p><strong>Tel 3:</strong> {prov.phone3}</p>}

                            <div className={styleD.cardButtons}>
                                <button
                                    className={styleD.updateBtn}
                                    onClick={() => handleUpdateProducts(prov.id)}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Actualizando..." : "Actualizar Productos"}
                                </button>
                                {/* <button className={styleD.editBtn}>Editar</button> */}
                                <button
                                    className={styleD.deleteBtn}
                                    onClick={() => handleDelete(prov.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}

                    {providers.length === 0 && (
                        <p className={styleD.emptyMsg}>No hay proveedores creados aún</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Distribuitor;
