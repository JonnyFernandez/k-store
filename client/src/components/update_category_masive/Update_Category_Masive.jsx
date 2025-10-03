import React, { useState } from 'react';
import m from './Update_Category_Masive.module.css';
import { useProd } from '../../context/ProdContext';


const Update_Category_Masive = ({ toggleOpen }) => {
    const { categories, updateCostMasiveCategory } = useProd()


    const [formData, setFormData] = useState({ distributorId: 0, percentage: "" });



    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "percentage" && !/^(-?\d+)?$/.test(value)) {
            return;
        }

        setFormData((prevData) => ({ ...prevData, [name]: name === "percentage" ? value : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { distributorId, percentage } = formData;

        if (!distributorId || percentage === "" || isNaN(Number(percentage))) {
            Swal.fire({
                icon: "warning",
                title: "Formulario incompleto",
                text: "Por favor, selecciona un Categoria y agrega un porcentaje válido.",
            });
            return;
        }

        await updateCostMasiveCategory(distributorId, { costUpdate: Number(percentage) });
        alert('Actualizacion completa')
        setFormData({ distributorId: 0, percentage: "" })
        toggleOpen()

    };

    const renderCategoryOptions = () => {
        return categories.map((distributor) => (
            <option key={distributor.id} value={distributor.id}>
                {distributor.name}
            </option>
        ));
    };

    return (
        <div className={m.formContainer}>
            <h2 className={m.formTitle}>Actualizar Costo Por Categoria</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="distributorId" className={m.label}>
                    Categoria:
                </label>
                <select
                    id="distributorId"
                    name="distributorId"
                    onChange={handleInputChange}
                    value={formData.distributorId}
                    className={m.select}
                >
                    <option value="">Selecciona un Categoria</option>
                    {renderCategoryOptions()}
                </select>

                <label htmlFor="percentage" className={m.label}>
                    Porcentaje de actualización:
                </label>
                <input
                    id="percentage"
                    type="text"
                    name="percentage"
                    placeholder="Ingresa un porcentaje (positivo o negativo)"
                    onChange={handleInputChange}
                    value={formData.percentage}
                    className={m.input}
                />

                <button type="submit" className={m.button}>
                    Actualizar
                </button>
            </form>
        </div>
    );
};

export default Update_Category_Masive;
