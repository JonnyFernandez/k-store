import { useState } from 'react';
import { getProductSearch, updateProduct } from '../../api/product';
import { Nav } from '../../components';
import styleC from './UpdateStock.module.css';
import Swal from 'sweetalert2';

const UpdateStock = () => {

    const [barcode, setBarcode] = useState('');
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({ cost: '', stock: '', name: '' });
    const [message, setMessage] = useState('');

    // Buscar producto por código de barras
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { data } = await getProductSearch(barcode);

            if (data && Array.isArray(data) && data.length > 0) {
                const found = data[0]; // Tomamos el primer producto
                setProduct(found);
                setFormData({
                    name: found.name || '',
                    cost: found.cost || 0,
                    stock: found.stock || 0,
                });
                setMessage('');
            } else {
                setProduct(null);
                setMessage('⚠️ No se encontró ningún producto con ese código.');
            }
        } catch (error) {
            console.error(error);
            setMessage('❌ Error al buscar el producto.');
            setProduct(null);
        }
    };

    // Manejar cambios del formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Actualizar producto
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!product) return;

        try {
            const aux = await updateProduct(product.id, formData);
            if (aux.status === 201) {
                Swal.fire({
                    title: '✅ Producto actualizado',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            setProduct(null)
            setFormData({ cost: '', stock: '', name: '' })
            setMessage('')
            setBarcode('')


        } catch (error) {
            console.error(error);
            Swal.fire({
                title: '❌ Error',
                text: 'No se pudo actualizar el producto.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545',
            });
        }
    };

    return (
        <div>
            <Nav />
            <div className={styleC.updateContainer}>
                <h1>Actualizar Stock</h1>

                <form onSubmit={handleSearch} className={styleC.searchForm}>
                    <input
                        type="text"
                        placeholder="Ingrese código de barras"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className={styleC.input}
                    />
                    <button type="submit" className={styleC.searchBtn}>Buscar</button>
                </form>

                {message && <p className={styleC.message}>{message}</p>}

                {product && (
                    <div className={styleC.productCard}>
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                                className={styleC.image}
                            />
                        )}

                        <form onSubmit={handleUpdate} className={styleC.form}>
                            <label>
                                Nombre:
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled
                                />
                            </label>

                            <label>
                                Costo:
                                <input
                                    type="number"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                Stock:
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                />
                            </label>

                            <button type="submit" className={styleC.updateBtn}>
                                Actualizar
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateStock;
