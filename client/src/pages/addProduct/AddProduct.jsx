import React, { useState, useEffect } from 'react';
import f from './AddProduct.module.css'
import axios from 'axios';
import { useProd } from '../../context/ProdContext'
import { FaMapMarkerAlt, FaChevronLeft, FaArrowLeft, FaWhatsapp, FaEnvelope, FaArrowUp, FaRegTrashAlt } from "react-icons/fa";
import { hardcodeCategories, hardcodeProviders } from '../../utils/data';





const AddProduct = () => {

    const { create_Prod, errors: api_error } = useProd()

    const categories = hardcodeCategories()
    const distributors = hardcodeProviders()

    const [isOffer, setIsOffer] = useState(false)
    const [featured, setFeatured] = useState(false)


    const [inputs, setInputs] = useState(() => ({
        image: "",
        name: "",
        description: "",
        code: "",
        cost: "",
        isFeatured: false,
        offer: false,
        stock: "",
        minStock: "",
        profit: "",
        provider: "",
        category: "",
    }));





    const data = {
        ...inputs,
        name: inputs.name.charAt(0).toUpperCase() + inputs.name.substring(1),
        cost: Number(inputs.cost),
        stock: Number(inputs.stock),
        description: inputs.description || inputs.name,
        minStock: Number(inputs.minStock),
        profit: Number(inputs.profit),
        isFeatured: featured === true ? true : false,
        offer: isOffer === true ? true : false,

    }

    const [errors, setErrors] = useState({});





    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSelect = (e, type) => {
        const { value } = e.target;
        if (type === 'provider') {
            if (inputs.distributor?.includes(value)) {
                alert(`Distribuidor ya agregado!`);
            } else {
                setInputs({ ...inputs, provider: value });
            }
        } else if (type === 'category') {
            if (inputs.category?.includes(value)) {
                alert(`Categoría ya agregada!`);
            } else {
                setInputs({ ...inputs, category: value });
            }
        }
    };

    const handleDelete = () => {
        setInputs({
            ...inputs,
            category: ""
        });
    };
    const handleDeleteProvider = () => {
        setInputs({
            ...inputs,
            provider: ""
        });
    };

    const handleUploadImage = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'assistt_file');

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dkx6y2e2z/image/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setInputs({ ...inputs, image: response.data.secure_url });
        } catch (error) {
            console.error('Error al cargar la imagen:', error);
            alert('Error al cargar la imagen. Inténtalo de nuevo.');
        }
    };

    const validateInputs = () => {
        const errors = {};
        if (!inputs.name) errors.name = 'El nombre es obligatorio';
        // if (!inputs.description) errors.description = 'La descripción es obligatoria';
        if (inputs.cost <= 0) errors.cost = 'El "costo" debe ser mayor a 0';
        if (inputs.stock < 0) errors.stock = 'El stock no puede ser negativo';
        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        create_Prod(data);
        setInputs((prevInputs) => ({
            image: '',
            name: '',
            description: '',
            code: '',
            cost: '',
            stock: '',
            profit: prevInputs.profit,
            minStock: '',
            provider: prevInputs.provider,  // <-- Mantiene los distribuidores
            category: prevInputs.category  // <-- Mantiene las categorías
        }));
    };




    return (
        <div className={f.addProd}>
            <div className={f.addProdHeader}>Agregar Producto</div>

            <div className={f.addProdDivsInputs}>
                {inputs.image && (
                    <div className={f.divImage}>
                        <img src={inputs.image} alt="Vista previa del producto" />
                    </div>
                )}

                {/* ------------------- div derecha---------------------- */}
                <div className={f.addProdDivsInputsRight}>
                    <form className={f.formInputs} onSubmit={handleSubmit}>

                        {/* ✅ Subir archivo */}
                        <input
                            className={f.imageInput}
                            type="file"
                            accept="image/*"
                            onChange={handleUploadImage}
                        />

                        {/* ✅ Ingresar URL */}
                        <input
                            className={f.nameInput}
                            type="text"
                            placeholder="O pegar URL de la imagen"
                            name="image"
                            value={inputs.image}
                            onChange={handleChange}
                        />

                        <div className={f.firstblockForm}>
                            <input
                                className={f.nameInput}
                                type="text"
                                placeholder="Nombre del producto"
                                name="name"
                                value={inputs.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className={f.error}>{errors.name}</p>}

                            <input
                                className={f.nameInput}
                                type="text"
                                placeholder="Descripcion"
                                name="description"
                                value={inputs.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={f.firstblockForm}>
                            <input
                                className={f.nameInput}
                                type="number"
                                placeholder="Costo"
                                name="cost"
                                value={inputs.cost}
                                onChange={handleChange}
                                min="0"
                            />
                            {errors.cost && <p className={f.error}>{errors.cost}</p>}

                            <input
                                className={f.nameInput}
                                type="number"
                                placeholder="Ganancia"
                                name="profit"
                                value={inputs.profit}
                                onChange={handleChange}
                                min="0"
                            />
                            <input
                                className={f.nameInput}
                                type="number"
                                placeholder="Stock"
                                name="stock"
                                value={inputs.stock}
                                onChange={handleChange}
                                min="0"
                            />
                            <input
                                className={f.nameInput}
                                type="number"
                                placeholder="Stock mínimo"
                                name="minStock"
                                value={inputs.minStock}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className={f.checks}>
                            <label className={f.radioLabel}>
                                Destacado:
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={() => setFeatured((prev) => !prev)}
                                    className={f.radioInput}
                                />
                            </label>
                            <label className={f.radioLabel}>
                                Oferta:
                                <input
                                    type="checkbox"
                                    checked={isOffer}
                                    onChange={() => setIsOffer((prev) => !prev)}
                                    className={f.radioInput}
                                />
                            </label>
                        </div>

                        <input
                            type="text"
                            placeholder="Código"
                            name="code"
                            value={inputs.code}
                            onChange={handleChange}
                        />

                        <div className={f.config}>
                            <div className={f.config1}>
                                {/* Categoría */}
                                <label htmlFor="category" className={f.label}>
                                    Categoría/s:
                                    <select
                                        className={f.selecItems}
                                        name="category"
                                        id="category"
                                        value={inputs.category || ""}
                                        onChange={(e) => handleSelect(e, "category")}
                                    >
                                        <option value="">Seleccionar Categoría</option>
                                        {categories?.map((category, index) => (
                                            <option key={index} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div className={f.selectedCategory}>
                                    {inputs.category?.length > 0 && (
                                        <div className={f.itemsCategory}>
                                            <div className={f.itemSelected}>
                                                {inputs.category}
                                                <button
                                                    className={f.botonX}
                                                    type="button"
                                                    onClick={handleDelete}
                                                >
                                                    <FaRegTrashAlt size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={f.config2}>
                                {/* Proveedor */}
                                <label htmlFor="provider" className={f.label}>
                                    Proveedor/es:
                                    <select
                                        className={f.selecItems}
                                        name="provider"
                                        id="provider"
                                        value={inputs.provider || ""}
                                        onChange={(e) => handleSelect(e, "provider")}
                                    >
                                        <option value="">Seleccionar Proveedor</option>
                                        {distributors?.map((provider, index) => (
                                            <option key={index} value={provider}>
                                                {provider}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div className={f.selectedSupplier}>
                                    {inputs.provider?.length > 0 && (
                                        <div className={f.itemsCategory}>
                                            <div className={f.itemSelected}>
                                                {inputs.provider}
                                                <button
                                                    className={f.botonX}
                                                    type="button"
                                                    onClick={handleDeleteProvider}
                                                >
                                                    <FaRegTrashAlt size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {api_error?.length
                                ? api_error.map((item, index) => (
                                    <p key={index} className={f.errorCreatedProd}>
                                        {item}
                                    </p>
                                ))
                                : ""}
                        </div>

                        <button className={f.sendProd}>Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct