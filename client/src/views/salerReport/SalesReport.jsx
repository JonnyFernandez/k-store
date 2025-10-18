import { useEffect, useState } from "react";
import { getReportOrders } from "../../api/product";
import { Nav } from "../../components";
import styleC from "./SalesReport.module.css";
import { NavLink } from "react-router-dom";

const SalesReport = () => {
    const today = new Date().toISOString().split("T")[0];

    const [date1, setDate1] = useState(() => localStorage.getItem("savedDate1") || today);
    const [date2, setDate2] = useState(() => localStorage.getItem("savedDate2") || today);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Guardar fechas cada vez que cambian
    useEffect(() => {
        localStorage.setItem("savedDate1", date1);
        localStorage.setItem("savedDate2", date2);
    }, [date1, date2]);

    // ✅ Si hay fechas guardadas, generar reporte automáticamente al volver
    useEffect(() => {
        const savedDate1 = localStorage.getItem("savedDate1");
        const savedDate2 = localStorage.getItem("savedDate2");

        if (savedDate1 && savedDate2) {
            fetchReport(savedDate1, savedDate2);
        }
    }, []);

    const fetchReport = async (from = date1, to = date2) => {
        try {
            setLoading(true);
            const { data } = await getReportOrders(from, to);
            setReport(data);
        } catch (error) {
            console.error("Error al obtener el reporte:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchReport();
    };

    return (
        <div className={styleC.container}>
            <Nav />

            <div className={styleC.reportContainer}>
                <h1>📊 Reporte de Ventas</h1>

                <form onSubmit={handleSubmit} className={styleC.form}>
                    <label>
                        Desde:
                        <input
                            type="date"
                            value={date1}
                            onChange={(e) => setDate1(e.target.value)}
                        />
                    </label>
                    <label>
                        Hasta:
                        <input
                            type="date"
                            value={date2}
                            onChange={(e) => setDate2(e.target.value)}
                        />
                    </label>
                    <button type="submit" className={styleC.btn}>
                        Generar
                    </button>
                </form>

                {loading && <p className={styleC.loading}>Cargando reporte...</p>}

                {!loading && report && (
                    <div className={styleC.result}>
                        {/* <h2>{report.period}</h2> */}
                        <p>Total de órdenes: {report.report.length}</p>

                        <table className={styleC.table}>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Fecha</th>
                                    <th>Vendedor</th>
                                    <th>Estado</th>
                                    <th>Método de Pago</th>
                                    <th>Total</th>
                                    <th>Ganancia</th>
                                    <th>Deuda</th>
                                    <th>Detalles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.report.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.code}</td>
                                        <td>{order.date}</td>
                                        <td>{order.seller}</td>
                                        <td
                                            className={
                                                order.status === "Completo"
                                                    ? styleC.complete
                                                    : styleC.pending
                                            }
                                        >
                                            {order.status}
                                        </td>
                                        <td>{order.payment_method}</td>
                                        <td>
                                            $
                                            {parseFloat(order.total).toLocaleString("es-AR")}
                                        </td>
                                        <td>
                                            $
                                            {parseFloat(order.gross_profit).toLocaleString(
                                                "es-AR"
                                            )}
                                        </td>
                                        <td>
                                            $
                                            {parseFloat(
                                                order.debt <= 0 ? 0 : order.debt
                                            ).toLocaleString("es-AR")}
                                        </td>
                                        <td>
                                            <NavLink
                                                to={`/order-detail/${order.id}`}
                                                className={styleC.orderDetails}
                                            >
                                                Details
                                            </NavLink>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesReport;
