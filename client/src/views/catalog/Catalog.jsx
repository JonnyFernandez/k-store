import styleC from './Catalog.module.css';
import { Card, Nav } from '../../components';
import { useEffect, useState } from 'react';
import {
    getProducts,
    getCategory,
    getProvider,
    getProductslowStock,
    getProductSearch
} from '../../api/product';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        provider: '',
        search: '',
        lowStock: false
    });
    console.log(filters);

    // Cargar datos iniciales
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [prodRes, catRes, provRes] = await Promise.all([
                getProducts(),
                getCategory(),
                getProvider()
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
            setProviders(provRes.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    // Manejar cambios en filtros
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Buscar productos
    const handleSearch = async () => {
        try {
            let res;
            if (filters.lowStock) {
                res = await getProductslowStock();
            } else if (filters.search) {
                res = await getProductSearch(filters.search);
            } else {
                res = await getProducts();
            }

            let filtered = res.data;

            if (filters.category) {
                filtered = filtered.filter(p => p.category === (filters.category));
            }
            if (filters.provider) {
                filtered = filtered.filter(p => p.provider === (filters.provider));
            }

            setProducts(filtered);
        } catch (error) {
            console.error("Error aplicando filtros:", error);
        }
    };

    // Ejecutar búsqueda cuando cambia algún filtro
    useEffect(() => {
        handleSearch();
    }, [filters]);

    return (
        <div className={styleC.catalog}>
            <Nav />
            <div className={styleC.catalogCont}>
                <div className={styleC.headerContain}>
                    <div className={styleC.catalogHeader}>
                        {/* Categoría */}
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                        {/* Proveedor */}
                        <select
                            name="provider"
                            value={filters.provider}
                            onChange={handleFilterChange}
                        >
                            <option value="">Todos los proveedores</option>
                            {providers.map(prov => (
                                <option key={prov.id} value={prov.name}>{prov.name}</option>
                            ))}
                        </select>

                        {/* Búsqueda */}
                        <input
                            type="text"
                            name="search"
                            placeholder="Buscar por nombre o código"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />

                        {/* Low Stock */}
                        <button
                            onClick={() =>
                                setFilters(prev => ({ ...prev, lowStock: !prev.lowStock }))
                            }
                            className={filters.lowStock ? styleC.activeLowStock : ''}
                        >
                            {filters.lowStock ? 'Mostrar Todos' : 'Stock Bajo'}
                        </button>
                    </div>

                </div>
                {/* Productos */}
                <div className={styleC.cardContainer}>
                    {products.length > 0 ? (
                        products.map(item => (
                            <div key={item.id} className={styleC.cardDiv}>
                                <Card
                                    id={item.id}
                                    code={item.code}
                                    name={item.name}
                                    image={item.image}
                                    stock={item.stock}
                                    minStock={item.minStock}
                                    price={item.price}
                                    discountedPrice={item.discountedPrice}
                                    discount={item.discount}
                                    isActive={item.isActive}
                                    profit_amount={item.profit_amount}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron productos.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Catalog;
