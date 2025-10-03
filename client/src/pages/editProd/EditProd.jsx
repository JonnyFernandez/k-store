import { useParams, useNavigate, NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import stylesP from './EditProd.module.css';
import axios from 'axios';
import { api_prod_details, api_prod_detail_update } from '../../api/product';
import { hardcodeCategories, hardcodeProviders } from '../../utils/data';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';



const EditProd = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        code: "",
        name: "",
        description: "",
        profit: 0,
        cost: 0,
        stock: 0,
        minStock: 0,
        category: "",
        distributor: "",
        image: ""
    });

    // console.log(inputs);


    const [originalData, setOriginalData] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    const categories = hardcodeCategories();
    const distributors = hardcodeProviders();

    useEffect(() => {
        if (user?.type !== "admin") {
            navigate(`/detail/${id}`);
            return;
        }

        const fetchProduct = async () => {
            try {
                const { data } = await api_prod_details(id);


                setInputs({
                    code: data.code || "",
                    name: data.name || "",
                    description: data.description || "",
                    profit: data.profit || 0,
                    cost: data.cost || 0,
                    stock: data.stock || 0,
                    minStock: data.minStock || 0,
                    category: data.category || "",
                    distributor: data.distributor || "",
                    image: data.image || "",
                });
                setOriginalData(data);
            } catch {
                Swal.fire("Error", "No se pudo cargar el producto.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleChange = ({ target: { name, value } }) => {
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadImage = async ({ target }) => {
        const file = target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "assistt_file");

        try {
            const { data } = await axios.post(
                "https://api.cloudinary.com/v1_1/dkx6y2e2z/image/upload",
                formData
            );
            setInputs((prev) => ({ ...prev, image: data.secure_url }));
        } catch {
            Swal.fire("Error", "No se pudo subir la imagen.", "error");
        }
    };

    const validateInputs = () => {
        const newErrors = {};
        if (!inputs.name.trim()) newErrors.name = "El nombre es obligatorio.";
        if (!inputs.cost || parseFloat(inputs.cost) <= 0)
            newErrors.cost = "El costo debe ser mayor a 0.";
        if (inputs.stock < 0) newErrors.stock = "El stock no puede ser negativo.";
        if (inputs.minStock < 0)
            newErrors.minStock = "El stock mínimo no puede ser negativo.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const updatedFields = Object.keys(inputs).reduce((changes, key) => {
            if (inputs[key] !== originalData[key]) {
                changes[key] = inputs[key];
            }
            return changes;
        }, {});

        if (Object.keys(updatedFields).length === 0) {
            Swal.fire("Sin Cambios", "No hay modificaciones para guardar.", "info");
            return;
        }

        try {
            await api_prod_detail_update(id, updatedFields);
            Swal.fire("Éxito", "Producto actualizado correctamente.", "success").then(
                () => navigate(`/detail/${id}`)
            );
        } catch {
            Swal.fire("Error", "No se pudo actualizar el producto.", "error");
        }
    };

    if (loading) return <p className="loading">Cargando producto...</p>;
    if (!inputs) return <p className="error">Error al cargar los datos.</p>;



    return (
        <div className={stylesP.container}>
            <h2 className={stylesP.title}>Editar Producto</h2>
            <form onSubmit={handleSubmit} className={stylesP.form}>
                <div>
                    <label>Code</label>
                    <input
                        type="text"
                        name="code"
                        value={inputs.code}
                        onChange={handleChange}
                    />
                    {errors.code && <span className={stylesP.errors}>{errors.code}</span>}
                </div>
                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={inputs.name}
                        onChange={handleChange}
                    />
                    {errors.name && <span className={stylesP.errors}>{errors.name}</span>}
                </div>
                <div>
                    <label> Descripcion </label>
                    <input
                        type="text"
                        name="description"
                        value={inputs.description}
                        onChange={handleChange}
                    />
                    {errors.description && <span className={stylesP.errors}>{errors.description}</span>}
                </div>

                <div>
                    <label>Costo</label>
                    <input
                        type="number"
                        name="cost"
                        value={inputs.cost}
                        onChange={handleChange}
                    />
                    {errors.cost && <span className={stylesP.errors}>{errors.cost}</span>}
                </div>
                <div>
                    <label>Margen</label>
                    <input
                        type="number"
                        name="profit"
                        value={inputs.profit}
                        onChange={handleChange}
                    />
                    {errors.profit && <span className={stylesP.errors}>{errors.profit}</span>}
                </div>

                <div>
                    <label>Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={inputs.stock}
                        onChange={handleChange}
                    />
                    {errors.stock && <span className={stylesP.errors}>{errors.stock}</span>}
                </div>

                <div>
                    <label>Stock Mínimo</label>
                    <input
                        type="number"
                        name="minStock"
                        value={inputs.minStock}
                        onChange={handleChange}
                    />
                    {errors.minStock && <span className="error">{errors.minStock}</span>}
                </div>

                <div>
                    <label>Categoría</label>
                    <select
                        name="category"
                        value={inputs.category}
                        onChange={handleChange}
                    >
                        <option value="">Seleccionar</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Distribuidor</label>
                    <select
                        name="distributor"
                        value={inputs.distributor}
                        onChange={handleChange}
                    >
                        <option value="">Seleccionar</option>
                        {distributors.map((prov) => (
                            <option key={prov} value={prov}>
                                {prov}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Imagen (URL)</label>
                    <input
                        type="text"
                        name="image"
                        value={inputs.image}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Subir Imagen</label>
                    <input type="file" accept="image/*" onChange={handleUploadImage} />
                </div>

                {inputs.image && (
                    <div className="preview">
                        <p>Vista previa:</p>
                        <img src={inputs.image} alt="preview" />
                    </div>
                )}

                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
};

export default EditProd;
