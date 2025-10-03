import orderCardStyle from './OlderCard.module.css';
import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import { api_order_update_invoice } from '../../api/product';

const OlderCard = ({ id, code, payment_method, cuit, name, status, debt, total, clientInvoice, createdAt, bank_acount }) => {
    const [facturado, setFacturado] = useState(clientInvoice);
    const [loading, setLoading] = useState(false);
    // console.log(bank_acount);


    const statusClass = {
        "Cancelado": "canceledCar",
        "Incompleto": "incompletedCar",
        "Pendiente": "pendingCard",
        "Completo": "orderCard",
    }[status] || "orderCard";

    const paymentLabels = {
        cash: "Efectivo",
        electronic: "Transf / QR",
        card: "Débito / Crédito",
    };

    const payment = paymentLabels[payment_method] || "Otro";
    const formattedDate = new Date(createdAt).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const formattedTotal = Number(total)?.toLocaleString('es-AR', { minimumFractionDigits: 2 });
    const formattedDebt = Number(debt)?.toLocaleString('es-AR', { minimumFractionDigits: 2 });

    const toggleFacturado = async () => {
        try {
            setLoading(true);
            const nuevoEstado = !facturado;

            // Actualizar en el backend
            await api_order_update_invoice(id);

            // Actualizar en tiempo real en la UI
            setFacturado(nuevoEstado);
        } catch (err) {
            console.error("Error al actualizar estado:", err);
            alert("No se pudo actualizar el estado en la base de datos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={orderCardStyle[statusClass]}>
            <div className={orderCardStyle.block1}>
                <b>Cod: {code}</b>
                <span>Fecha: {formattedDate}</span>
            </div>

            <div className={orderCardStyle.block1}>
                <div>Cuit/DNI: {cuit || "No informado"}</div>
                <div>Nombre: {name || "Sin nombre"}</div>
            </div>

            <div className={orderCardStyle.block1}>
                <div>Estado: {status}</div>
                <p>Método: {payment}</p>
            </div>

            <div className={orderCardStyle.block1}>
                <label className={orderCardStyle.labelCheckbox}>
                    Factura Cliente:
                    <input
                        type="checkbox"
                        checked={facturado}
                        onChange={toggleFacturado}
                        disabled={loading}
                    />
                </label>
                <p>Cuenta: {bank_acount}</p>
            </div>


            <div className={orderCardStyle.block1}>
                <b>Total: $ {formattedTotal}</b>
                {debt > 0 && <p>Deuda: $ {formattedDebt}</p>}
            </div>

            <NavLink to={`/order-detail/${id}`}>Detalles</NavLink>
        </div>
    );
};

export default OlderCard;
