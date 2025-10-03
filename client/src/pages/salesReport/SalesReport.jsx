import styleSales from './SalesReport.module.css';
import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { useProd } from '../../context/ProdContext';
import { useAuth } from '../../context/AuthContext'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';



const SalesReport = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        getOrdersByDates,
        orders,
        getOrders: searchOrder,
        OrdersByCuit,
        OrdersByUsername,
        errors,
    } = useProd();

    const [dates, setDates] = useState({ startDate: "", endDate: "" });
    const [search, setSearch] = useState({ cuit: "", name: "", code: "" });

    const formattedStartDate = moment(dates.startDate).format("DD/MM/YYYY");
    const formattedEndDate = moment(dates.endDate).format("DD/MM/YYYY");

    // 🔹 Restringir acceso
    useEffect(() => {
        if (user?.type !== "admin") {
            Swal.fire({
                icon: "error",
                title: "Acceso Denegado",
                text: "No tienes permiso para acceder a esta página.",
                footer: "Soporte técnico:",
            });
            navigate("/catalog");
        }
    }, [user, navigate, user?.type]);

    // 🔹 Buscar por rango de fechas
    const searchByDate = useCallback(async () => {
        if (search.cuit || search.name || search.code) {
            Swal.fire({
                title: "Búsqueda por filtros",
                text: "Por favor, utiliza los filtros de búsqueda para encontrar órdenes específicas.",
                icon: "info",
                confirmButtonText: "Entendido",
                background: "#1e1e1e",
                color: "#fff",
            });
            return;
        }
        await getOrdersByDates(formattedStartDate, formattedEndDate);
    }, [search, formattedStartDate, formattedEndDate, getOrdersByDates]);

    // 🔹 Manejo de resultados
    useEffect(() => {
        if (errors.length > 0) {
            Swal.fire({
                title: "Error",
                text: errors.join("\n"),
                icon: "error",
                confirmButtonText: "Cerrar",
                background: "#1e1e1e",
                color: "#fff",
            });
            return;
        }

        if (Array.isArray(orders)) {
            if (orders.length > 0) {
                Swal.fire({
                    title: "Órdenes encontradas",
                    text: `Se encontraron ${orders.length} órdenes de compra.`,
                    icon: "success",
                    confirmButtonText: "Ver órdenes",
                    background: "#1e1e1e",
                    color: "#fff",
                }).then((result) => {
                    if (result.isConfirmed) navigate("/reportDetails");
                });
            } else {
                Swal.fire({
                    title: "Sin resultados",
                    text: "No se encontraron órdenes con esos datos.",
                    icon: "warning",
                    confirmButtonText: "Entendido",
                    background: "#1e1e1e",
                    color: "#fff",
                });
            }
        }
    }, [orders, errors, navigate]);

    // 🔹 Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "startDate" || name === "endDate") {
            setDates((prev) => ({ ...prev, [name]: value }));
        } else {
            setSearch((prev) => ({ ...prev, [name]: value }));
        }
    };

    // 🔹 Búsquedas específicas
    const searchByCode = () => search.code.trim() && searchOrder(search.code);
    const searchAllOrders = () =>
        window.confirm("¿Deseas mostrar todas las órdenes de compra?") && searchOrder();
    const searchByCuit = async () => search.cuit.trim() && (await OrdersByCuit(search.cuit));
    const searchByName = async () => search.name.trim() && (await OrdersByUsername(search.name));

    return (
        <div className={styleSales.salesContainer}>
            <h2 className={styleSales.titleSale}>Reporte de Ventas</h2>
            <div className={styleSales.searchGrid}>
                {/* Fecha */}
                <div className={styleSales.searchCard}>
                    <h6>Por Rango de Fecha</h6>
                    <div className={styleSales.dateInputs}>
                        <input
                            type="date"
                            name="startDate"
                            value={dates.startDate}
                            onChange={handleInputChange}
                            className={styleSales.input}
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={dates.endDate}
                            onChange={handleInputChange}
                            className={styleSales.input}
                        />
                    </div>
                    {dates.endDate && (
                        <button className={styleSales.searchButton} onClick={searchByDate}>
                            Buscar
                        </button>
                    )}
                </div>

                {/* Código */}
                <div className={styleSales.searchCard}>
                    <h6>Por Código de Orden</h6>
                    <input
                        type="text"
                        className={styleSales.input}
                        name="code"
                        value={search.code}
                        onChange={handleInputChange}
                        placeholder="Ej: #1234"
                    />
                    {search.code && (
                        <button onClick={searchByCode} className={styleSales.searchButton}>
                            Buscar
                        </button>
                    )}
                </div>

                {/* CUIT */}
                <div className={styleSales.searchCard}>
                    <h6>Por CUIT</h6>
                    <input
                        type="text"
                        className={styleSales.input}
                        name="cuit"
                        value={search.cuit}
                        onChange={handleInputChange}
                        placeholder="Ej: 20123456789"
                    />
                    {search.cuit && (
                        <button onClick={searchByCuit} className={styleSales.searchButton}>
                            Buscar
                        </button>
                    )}
                </div>

                {/* Nombre */}
                <div className={styleSales.searchCard}>
                    <h6>Por Nombre</h6>
                    <input
                        type="text"
                        className={styleSales.input}
                        name="name"
                        value={search.name}
                        onChange={handleInputChange}
                        placeholder="Ej: Juan Pérez"
                    />
                    {search.name && (
                        <button onClick={searchByName} className={styleSales.searchButton}>
                            Buscar
                        </button>
                    )}
                </div>

                {/* Ver todo */}
                <div className={styleSales.searchCardFull}>
                    <h6>Ver todas las compras</h6>
                    <button onClick={searchAllOrders} className={styleSales.searchButton}>
                        Mostrar Todo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalesReport;


