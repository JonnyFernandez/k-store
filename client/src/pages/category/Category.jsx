import React, { useState, useEffect } from 'react';
import f from './Category.module.css';
import { useProd } from '../../context/ProdContext';
import { Modal, Update_Category_Masive } from '../../components'

const Category = () => {

    const [name, setName] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const { getCategory, categories, createCategory, deleteCategory } = useProd()


    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        await getCategory();

    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim()) {
            alert("El nombre de la categoría no puede estar vacío.");
            return;
        }

        let aux = { 'name': name.trim().toUpperCase() }
        await createCategory(aux);
        alert("Categoría creada correctamente.");
        setName("");
        fetchCategories();
    };

    const handleDelete = async (id) => {
        await deleteCategory(id);
        alert("Categoría eliminada correctamente.");
        fetchCategories();
    };

    return (
        <div className={f.category}>
            <h2>Gestión de Categorías</h2>
            <button onClick={toggleOpen}>Actualizacion masiva</button>
            <form
                className={`${f.inputsContainerCategory} ${f.responsiveForm}`}
                onSubmit={handleSubmit}
            >
                <label htmlFor="name" className={f.label}>
                    Nombre de la Categoría
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Escribe el nombre de la categoría"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Guardar Categoría</button>
            </form>

            <h3>Lista de Categorías</h3>
            <div className={f.categoriesList}>
                {categories.map((category) => (
                    <div key={category.id} className={f.categoryItem}>
                        <span>{category.name}</span>
                        <button onClick={() => handleDelete(category.id)}>Eliminar</button>
                    </div>
                ))}
            </div>
            <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
                <Update_Category_Masive toggleOpen={toggleOpen} />
            </Modal>
        </div>
    );
};

export default Category;
