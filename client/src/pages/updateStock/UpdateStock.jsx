import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useProd } from '../../context/ProdContext';
import u from './UpdateStock.module.css';

const UpdateStock = () => {
    const navigate = useNavigate();
    const { prod, allProduct, update_stock } = useProd();

    const [search, setSearch] = useState('');
    const [inputs, setInputs] = useState({});
    const [inputStock, setInputStock] = useState(0);

    // Obtener productos solo una vez al montar
    const fetchData = useCallback(async () => {
        await allProduct();
    }, [allProduct]);

    useEffect(() => {
        if (!prod) fetchData();
    }, []);

    // console.log(prod);


    // Calcular datos del stock dinámicamente
    const data = useMemo(() => ({
        stock: Number(inputs.stock || 0) + Number(inputStock),
        cost: Number(inputs.cost || 0),
    }), [inputs.stock, inputs.cost, inputStock]);

    const handleSearch = async () => {
        const product = prod?.find((p) => p.code.includes(search.trim()));

        if (product) {
            setInputs(product);
        } else {
            const { isConfirmed } = await Swal.fire({
                title: 'Producto no encontrado',
                text: '¿Desea agregar el producto ahora?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Agregar',
                cancelButtonText: 'Cancelar',
            });

            if (isConfirmed) navigate('/prod');
        }
    };

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se actualizarán los datos del producto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
        });

        if (!isConfirmed) return;

        try {
            await update_stock(inputs.id, data);
            await Swal.fire('Actualizado', 'El producto ha sido actualizado correctamente.', 'success');

            setInputs({});
            setSearch('');
            setInputStock(0);
            fetchData();
        } catch {
            Swal.fire('Error', 'No se pudo actualizar el producto. Inténtalo de nuevo.', 'error');
        }
    };

    return (
        <div className={u.container}>
            <h2 className={u.titleUpdate}>Buscar y Actualizar</h2>
            <input
                type="text"
                placeholder="Buscar por código de barras"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className={u.updateSearchButton} onClick={handleSearch}>Buscar</button>

            {inputs.code && (
                <div>
                    <form className={u.form} onSubmit={handleSubmit}>
                        <label htmlFor="name">Nombre del producto</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Nombre del producto"
                            value={inputs.name || ''}
                            onChange={handleChange}
                        />

                        <label htmlFor="stock">Stock actual: {inputs.stock}</label>
                        <input
                            type="number"
                            name="stock"
                            id="stock"
                            placeholder="Cantidad a agregar"
                            value={inputStock}
                            onChange={(e) => setInputStock(e.target.value)}
                            min="0"
                        />

                        <label htmlFor="cost">Costo:</label>
                        <input
                            type="number"
                            name="cost"
                            id="cost"
                            placeholder="Costo"
                            value={inputs.cost || ''}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                        />

                        <button type="submit">Guardar Producto</button>
                    </form>

                    {inputs.image && (
                        <div className={u.imageUpdateContainer}>
                            <img src={inputs.image} alt={inputs.name || 'Producto'} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UpdateStock;
