import React, { useState, useEffect, useMemo } from 'react';
import r from './ReportDetails.module.css';
import { useProd } from '../../context/ProdContext';
import { OlderCard } from '../../components';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const ReportDetails = () => {
    const navigate = useNavigate();
    const { orders } = useProd();
    const { user } = useAuth();

    const [filteredOrders, setFilteredOrders] = useState([]);
    const [paymentType, setPaymentType] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");



    useEffect(() => {
        if (!orders.length) {
            navigate('/sales-report');
        }
        if (user?.type !== "admin") {
            Swal.fire({
                icon: "error",
                title: "Acceso Denegado",
                text: "No tienes permiso para acceder a esta página.",
                footer: "Soporte técnico:",
            });
            navigate("/catalog");
        }
    }, [orders, navigate, user?.type]);

    const parseMoney = (value) => parseFloat(value) || 0;

    // Calcular resumen usando useMemo (optimiza recalculo)
    const resumen = useMemo(() => {
        const filters = {
            all: orders,
            cash: orders.filter(o => o.payment_method === "cash"),
            card: orders.filter(o => o.payment_method === "card"),
            electronic: orders.filter(o => o.payment_method === "electronic"),
            invoiced: orders.filter(o => o.clientInvoice === true)
        };

        return {
            ...filters,
            profit: orders.reduce((acc, o) => acc + parseMoney(o.gross_profit), 0)
        };
    }, [orders]);

    const metricas = [
        { label: "Venta total", key: "all" },
        { label: "Electrónico", key: "electronic" },
        { label: "Débito / Crédito", key: "card" },
        { label: "Efectivo", key: "cash" },
        { label: "Facturadas", key: "invoiced" },
    ];

    const applyFilters = (type = paymentType, status = statusFilter, search = searchTerm) => {
        let result = [...orders];

        // Filtro por tipo de pago o facturadas
        if (type !== "all") {
            if (type === "invoiced") {
                result = result.filter(order => order.clientInvoice === true);
            } else {
                result = result.filter(order => order.payment_method === type);
            }
        }

        // Filtro por estado
        if (status !== "all") {
            result = result.filter(order => order.status === status);
        }

        // Filtro por búsqueda
        if (search) {
            const term = search.toLowerCase();
            result = result.filter(order =>
                order.clientName?.toLowerCase().includes(term) ||
                order.clientCuit?.toLowerCase().includes(term) ||
                order.code?.toLowerCase().includes(term)
            );
        }

        setFilteredOrders(result);
        setPaymentType(type);
        setStatusFilter(status);
        setSearchTerm(search);
    };

    // Inicializar filtrado
    useEffect(() => {
        applyFilters();
    }, [orders]);

    return (
        <div className={r.containerReport}>
            <div className={r.reportHeader}>
                {metricas.map(({ label, key }) => (
                    <div
                        key={key}
                        className={r.divFilters}
                        onClick={() => applyFilters(key, statusFilter, searchTerm)}
                    >
                        <div>{label}</div>
                        <div>
                            ${resumen[key].reduce?.((acc, o) => acc + parseMoney(o.total), 0).toLocaleString()}
                        </div>
                        <div>Órdenes: {resumen[key].length}</div>
                    </div>
                ))}

                <div className={r.divFilters}>
                    <div>Ganancia</div>
                    <div>${resumen.profit.toLocaleString()}</div>
                </div>

                <div className={r.statusButtons}>
                    {["all", "Pendiente", "Completo", "Incompleto"].map((status) => (
                        <button
                            key={status}
                            onClick={() => applyFilters(paymentType, status, searchTerm)}
                            className={statusFilter === status ? r.activeBtn : ""}
                        >
                            {status === "all" ? "Todas" : status}
                        </button>
                    ))}
                </div>

                <div className={r.searchContainer}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => applyFilters(paymentType, statusFilter, e.target.value)}
                        placeholder="Buscar por nombre, CUIT o código"
                        className={r.searchInput}
                    />
                </div>
            </div>

            <div className={r.reportBody}>
                {filteredOrders
                    ?.slice() // hacemos una copia para no mutar el estado
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .map(order => (
                        <OlderCard
                            key={order.id}
                            id={order.id}
                            code={order.code}
                            date={moment(order.date).format("DD/MM/YYYY")}
                            cuit={order.clientCuit}
                            name={order.clientName}
                            status={order.status}
                            payment_method={order.payment_method}
                            bank_acount={order.bank_acount}
                            debt={order.debt}
                            total={order.total}
                            clientInvoice={order.clientInvoice}
                            createdAt={order.createdAt}
                        />
                    ))}
            </div>

        </div>
    );
};

export default ReportDetails;
