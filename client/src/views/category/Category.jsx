import React, { useState, useEffect } from "react";
import styleCateg from "./Category.module.css";
import { Nav } from "../../components";
import axios from "axios";
import { getCategory, createCategory, deleteCategory } from "../../api/product";

const API_URL = "http://localhost:3001/api/categories"; // ajustá según tu backend

const Category = () => {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // console.log(categories);


    // 🔹 Obtener categorías al montar
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await getCategory()

            setCategories(data);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };

    // 🔹 Crear categoría
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return alert("El nombre es obligatorio");

        try {
            setIsLoading(true);
            const { data } = await createCategory({ name });
            setCategories([...categories, data]);
            setName("");
        } catch (error) {
            console.error("Error al crear categoría:", error);
            alert("No se pudo crear la categoría");
        } finally {
            setIsLoading(false);
        }
    };

    // 🔹 Eliminar categoría
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
        try {
            await deleteCategory(id);
            setCategories(categories.filter((cat) => cat.id !== id));
        } catch (error) {
            console.error("Error al eliminar categoría:", error);
            alert("No se pudo eliminar la categoría");
        }
    };

    // 🔹 Actualizar profit de una categoría
    const handleUpdateProfits = async (categoryId) => {
        if (!window.confirm("¿Actualizar profits de esta categoría?")) return;
        try {
            setIsUpdating(true);
            // await axios.put(`${API_URL}/${categoryId}/update-profits`);
            alert("Profits actualizados correctamente");
        } catch (error) {
            console.error("Error al actualizar profits:", error);
            alert("No se pudieron actualizar los profits");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className={styleCateg.pageWrapper}>
            <Nav />

            <div className={styleCateg.categoryContainer}>
                <h2>Gestión de Categorías</h2>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className={styleCateg.form}>
                    <input
                        type="text"
                        placeholder="Nombre de la categoría"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Agregar Categoría"}
                    </button>
                </form>

                {/* Listado */}
                <div className={styleCateg.cardsGrid}>
                    {categories.map((cat) => (
                        <div key={cat.id} className={styleCateg.card}>
                            <span className={styleCateg.categoryName}>{cat.name}</span>
                            <div className={styleCateg.cardButtons}>
                                <button
                                    className={styleCateg.updateBtn}
                                    onClick={() => handleUpdateProfits(cat.id)}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Actualizando..." : "Actualizar Profit"}
                                </button>
                                <button
                                    className={styleCateg.deleteBtn}
                                    onClick={() => handleDelete(cat.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <p className={styleCateg.emptyMsg}>No hay categorías creadas aún</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Category;
