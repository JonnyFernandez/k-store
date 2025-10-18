import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Nav } from '../../components';
import styleUp from './UpdateProduct.module.css';
import {
    getProductById,
    getCategory,
    getProvider,
    updateProduct,
    deleteProduct
} from '../../api/product';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const savedUser = localStorage.getItem('user')
    const user = savedUser ? JSON.parse(savedUser) : null
    // console.log(user);

    useEffect(() => {
        if (!user || (user.type !== 'admin')) return navigate('/catalog')
    }, [])



    const [formData, setFormData] = useState({
        name: '',
        code: '',
        stock: 0,
        minStock: 0,
        cost: 0,
        profit: 0,
        discount: 0,
        isActive: true,
        category: '',
        provider: '',
        image: ''
    });

    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes, provRes] = await Promise.all([
                    getProductById(id),
                    getCategory(),
                    getProvider()
                ]);

                const prod = prodRes.data;
                setFormData({
                    name: prod.name,
                    code: prod.code,
                    stock: prod.stock,
                    minStock: prod.minStock,
                    cost: prod.cost,
                    profit: prod.profit,
                    discount: prod.discount,
                    isActive: prod.isActive,
                    category: prod.category || '',
                    provider: prod.provider || '',
                    image: prod.image || ''
                });

                setCategories(catRes.data);
                setProviders(provRes.data);
            } catch (error) {
                Swal.fire('Error', 'No se pudo cargar el producto', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = ({ target: { name, value, type, checked } }) => {
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpdate = async e => {
        e.preventDefault();
        try {
            const res = await updateProduct(id, formData);
            if (res.status === 200 || res.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Producto actualizado correctamente',
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate('/catalog');
            }
        } catch {
            Swal.fire('Error', '❌ No se pudo actualizar el producto', 'error');
        }
    };

    const removeProd = async () => {
        const confirm = await Swal.fire({
            title: '¿Eliminar producto?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e74c3c'
        });

        if (confirm.isConfirmed) {
            try {
                const res = await deleteProduct(id);
                if (res.status === 200 || res.status === 201) {
                    Swal.fire('Eliminado', 'El producto fue eliminado correctamente', 'success');
                    navigate('/catalog');
                }
            } catch {
                Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
            }
        }
    };

    if (loading) return <div className={styleUp.loading}>Cargando...</div>;

    return (
        <div>
            <Nav />
            <div className={styleUp.updateProd}>
                <h2>
                    Editar producto: <span>{formData.name}</span>
                </h2>

                <form onSubmit={handleUpdate} className={styleUp.form}>
                    {/* Imagen */}
                    <div className={styleUp.imageSection}>
                        <img
                            src={formData.image || 'https://via.placeholder.com/150'}
                            alt={formData.name}
                            className={styleUp.imagePreview}
                        />
                        <label>URL de imagen:</label>
                        <input
                            type="text"
                            name="image"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Campos */}
                    <div className={styleUp.formGrid}>
                        {[
                            ['Nombre', 'name'],
                            ['Código', 'code'],
                            ['Stock', 'stock', 'number'],
                            ['Stock mínimo', 'minStock', 'number'],
                            ['Costo', 'cost', 'number'],
                            ['Ganancia (%)', 'profit', 'number'],
                            ['Descuento (%)', 'discount', 'number']
                        ].map(([label, name, type = 'text']) => (
                            <div key={name}>
                                <label>{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}

                        <label>Categoría:

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>Proveedor:

                            <select
                                name="provider"
                                value={formData.provider}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar proveedor</option>
                                {providers.map(prov => (
                                    <option key={prov.id} value={prov.name}>
                                        {prov.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className={styleUp.actions}>
                        <button type="submit" className={styleUp.btnSave}>
                            Guardar Cambios
                        </button>
                        <button
                            type="button"
                            onClick={removeProd}
                            className={styleUp.btnDelete}
                        >
                            Eliminar Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;
