import c from './Card.module.css';
import { useState, useEffect } from 'react';

const Card = ({ id, image, name, stock, minStock, price, code, isActive, isFeatured }) => {
    const defaultImage = 'https://i.pinimg.com/736x/29/f9/00/29f9000209f6361831d6696b7058746c.jpg';

    const getStockClass = (stock, minStock) => {
        if (stock === 0) return c.notStock;
        if (stock <= minStock) return c.lowStock;
        return c.cardStock;
    };

    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("products")) || [];
        const found = saved.find(p => p.id === id);
        if (found) setQuantity(found.quantity);
    }, [id]);

    const updateLocalStorage = (newQty) => {
        const saved = JSON.parse(localStorage.getItem("products")) || [];
        const exists = saved.find(p => p.id === id);
        let updated;

        if (exists) {
            updated = saved.map(p => p.id === id ? { ...p, quantity: newQty } : p);
        } else {
            updated = [...saved, { id, code, name, price, quantity: newQty }];
        }

        localStorage.setItem("products", JSON.stringify(updated));
    };

    const handleAdd = () => {
        const newQty = quantity + 1;
        if (newQty > Number(stock)) return
        setQuantity(newQty);
        updateLocalStorage(newQty);
    };

    const handleSubtract = () => {
        const newQty = quantity - 1;

        if (newQty >= 0) {
            setQuantity(newQty);

            if (newQty === 0) {
                // Eliminar producto del localStorage
                const saved = JSON.parse(localStorage.getItem('products')) || [];
                const updated = saved.filter(product => product.id !== id); // suponiendo que tenés `id` disponible
                localStorage.setItem('products', JSON.stringify(updated));
            } else {
                // Actualizar cantidad en localStorage
                updateLocalStorage(newQty);
            }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(value);
    };

    return (
        <div className={`${c.card} ${isActive ? c.active : c.inactive} ${isFeatured && isActive ? c.featured : ''}`}>
            <a href={`/detail/${id}`} className={c.headercard} target="_blank" rel="noopener noreferrer">
                <img src={image || defaultImage} alt={name} className={c.cardImage} />
            </a>

            <div className={c.cardContent}>
                <h2 className={c.cardTitle}>{name}</h2>
                <span>Cod: {code && String(code).slice(-4)}</span>
                <p className={getStockClass(stock, minStock)}><b>stock: {stock}</b></p>
                <p className={c.cardPrice}>
                    <strong>{Number(price) ? formatCurrency(price) : "00.00"}</strong>
                </p>
            </div>

            {<div className={c.cardActions}>
                {
                    quantity > 0 ? (
                        <div className={c.counter}>
                            <button className={c.counterBtn} onClick={handleSubtract}>-</button>
                            <span className={c.showQty}>{quantity}</span>
                            <button className={c.counterBtn} onClick={handleAdd}>+</button>
                        </div>
                    ) : (
                        Number(stock) > 0 && <button className={c.addBtn} onClick={handleAdd}>Agregar</button>
                    )
                }
            </div>}
        </div>
    );
};

export default Card;
