import { useEffect, useState } from "react";
import styleC from "./AddProduct.module.css";
import { Nav } from "../../components";
import { createProduct, getCategory, getProvider } from "../../api/product";
import { useNavigate } from 'react-router-dom';


const AddProduct = () => {

    const navigate = useNavigate()
    const savedUser = localStorage.getItem('user')
    const user = savedUser ? JSON.parse(savedUser) : null
    // console.log(user);

    useEffect(() => {
        if (!user) return navigate('/')
    }, [])

    const [categories, setCategories] = useState([])
    const [providers, setProviders] = useState([])

    const fetchData = async () => {
        const aux = await getCategory();
        const prov = await getProvider();
        setCategories(aux.data)
        setProviders(prov.data)
    }
    // console.log(categories);
    // console.log(providers);


    useEffect(() => {
        fetchData()
    }, [])

    const [formData, setFormData] = useState({
        image: "",
        name: "",
        code: "",
        stock: "",
        minStock: "",
        cost: "",
        profit: "",
        discount: "" || 0,
        category: "",
        provider: "",
    });

    // console.log(formData);


    // const categories = [
    //     "Artículos de limpieza",
    //     "Perfumería",
    //     "Bazar",
    //     "Ropa de trabajo",
    // ];

    // const providers = ["Sina", "Aromax", "CleanPro", "Distribuidora Sur"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Producto creado:", formData);

        // 🔹 Acá podrías llamar a tu API
        await createProduct(formData);

        alert("Producto agregado correctamente ✅");
        setFormData({
            image: "",
            name: "",
            code: "",
            stock: "",
            minStock: "",
            cost: "",
            profit: "",
            discount: "",
            category: "",
            provider: "",
        });
    };

    return (
        <div className={styleC.addProd}>
            <Nav />
            <div className={styleC.addProdContainer}>
                <h2 className={styleC.title}>Agregar nuevo producto</h2>

                <form className={styleC.form} onSubmit={handleSubmit}>
                    <div className={styleC.formGroup}>
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Jabón Azul"
                            required
                        />
                    </div>

                    <div className={styleC.formGroup}>
                        <label>Código</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="Ej: z-02"
                            required
                        />
                    </div>

                    <div className={styleC.formGroup}>
                        <label>Imagen (URL)</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/images/product.jpg"
                        />
                    </div>

                    <div className={styleC.row}>
                        <div className={styleC.formGroup}>
                            <label>Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className={styleC.formGroup}>
                            <label>Stock mínimo</label>
                            <input
                                type="number"
                                name="minStock"
                                value={formData.minStock}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className={styleC.row}>
                        <div className={styleC.formGroup}>
                            <label>Costo</label>
                            <input
                                type="number"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className={styleC.formGroup}>
                            <label>Ganancia (%)</label>
                            <input
                                type="number"
                                name="profit"
                                value={formData.profit}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className={styleC.formGroup}>
                            <label>Descuento (%)</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div className={styleC.row}>
                        <div className={styleC.formGroup}>
                            <label>Categoría</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map((cat, i) => (
                                    <option key={i} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styleC.formGroup}>
                            <label>Proveedor</label>
                            <select
                                name="provider"
                                value={formData.provider}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar proveedor</option>
                                {providers.map((prov, i) => (
                                    <option key={i} value={prov.name}>
                                        {prov.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className={styleC.btnSubmit}>
                        Crear producto
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
