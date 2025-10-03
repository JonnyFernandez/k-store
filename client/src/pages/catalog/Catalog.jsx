import p from './Catalog.module.css';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useProd } from '../../context/ProdContext';
import { FaMapMarkerAlt, FaWhatsapp, FaEnvelope, FaArrowUp } from "react-icons/fa";
import { hardcodeCategories, hardcodeProviders } from '../../utils/data';
import { Card } from '../../components'


const Catalog = () => {
    const { allProduct, prod, filter_product } = useProd();



    const categories = hardcodeCategories()
    const distributors = hardcodeProviders()

    const fetchData = async () => {
        await allProduct();
    };

    useEffect(() => {
        if (!prod || prod.length === 0) {
            fetchData();
        } else return;
    }, []);

    const defaultImage = 'https://i.pinimg.com/736x/eb/7d/c8/eb7dc8064bc6355d66ef6183db7c2a6d.jpg'
    // const defaultImage = 'https://i.pinimg.com/736x/29/f9/00/29f9000209f6361831d6696b7058746c.jpg'


    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [distributorFilter, setDistributorFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');


    useEffect(() => {
        if (statusFilter) filter_product('status', statusFilter);
        if (categoryFilter) filter_product('category', categoryFilter);
        if (priceFilter) filter_product(priceFilter === 'mas' ? 'price_high' : 'price_low');
        if (distributorFilter) filter_product('distributor', distributorFilter);
        if (stockFilter) filter_product(stockFilter === 'min' ? 'low_stock' : 'out_of_stock');
    }, [categoryFilter, priceFilter, distributorFilter, stockFilter, statusFilter]);



    // Primero, filtramos los productos normalmente
    const filteredProducts = prod?.filter(({ name, code }) =>
        [name, code].some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
    )?.sort((a, b) => {
        if (a.image && !b.image) return -1; // a tiene imagen y b no => a primero
        if (!a.image && b.image) return 1;  // b tiene imagen y a no => b primero
        return 0; // si ambos tienen o no tienen imagen, mantener el orden
    });


    const refresh = () => {
        fetchData();
    }

    // console.log(filteredProducts);

    return (
        <div className={p.prodManagement}>
            {/* <div onClick={refresh} className={p.titleProductManagement}>Product Management</div> */}
            <div className={p.filterContainer}>
                {/* Filtro por categoría */}
                <select className={p.filterSelect} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">Category</option>
                    {categories.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                </select>

                <select className={p.filterSelect} onChange={(e) => setDistributorFilter(e.target.value)}>
                    <option value="">Suplidor</option>
                    {distributors.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                </select>



                {/* Filtro por Estatus */}
                <select className={p.filterSelect} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Estatus</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                    <option value="offer">Oferta</option>
                    <option value="featured">Destacados</option>
                </select>



                {/* Filtro por stock */}
                <select className={p.filterSelect} onChange={(e) => setStockFilter(e.target.value)}>
                    <option value="">Stock</option>
                    <option value="min">Mínimo</option>
                    <option value="cero">Sin Stock</option>
                </select>

                {/* Barra de búsqueda */}
                <div className={p.searchContainer}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o código"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={p.filterSelect}
                    />
                </div>

                <button onClick={refresh}>Refresh</button>

            </div>

            {/* Renderizado de productos filtrados */}
            <div className={p.cardContainer}>
                {filteredProducts?.map(({ id, image, name, description, stock, minStock, price, code, isActive, isFeatured }) => (
                    <Card key={id} id={id} image={image} name={name} description={description} stock={stock} minStock={minStock} price={price} code={code} isActive={isActive} isFeatured={isFeatured} />
                ))}
            </div>
            <a href="#nav" className={p.btnFloating}>
                <FaArrowUp size={24} />
            </a>
        </div>
    );
};

export default Catalog;
