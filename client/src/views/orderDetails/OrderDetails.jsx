import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../api/product";
import { Nav } from "../../components";
import styleDetails from "./OrderDetails.module.css";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await getOrderById(id);
                setOrder(data);
            } catch (error) {
                console.error("Error al obtener el pedido:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <p className={styleDetails.loading}>Cargando pedido...</p>;
    if (!order) return <p className={styleDetails.error}>No se encontró el pedido.</p>;

    return (
        <div className={styleDetails.details}>
            <Nav />

            <div className={styleDetails.detailsContainer}>
                <h1>🧾 Detalles del Pedido</h1>

                <div className={styleDetails.headerInfo}>
                    <div>
                        <h3>Código</h3>
                        <p>{order.code}</p>
                    </div>
                    <div>
                        <h3>Fecha</h3>
                        <p>{order.date}</p>
                    </div>
                    <div>
                        <h3>Vendedor</h3>
                        <p>{order.seller}</p>
                    </div>
                    <div>
                        <h3>Método de Pago</h3>
                        <p>{order.payment_method}</p>
                    </div>
                    <div>
                        <h3>Estado</h3>
                        <p
                            className={
                                order.status === "Completo"
                                    ? styleDetails.complete
                                    : styleDetails.incomplete
                            }
                        >
                            {order.status}
                        </p>
                    </div>
                </div>

                <h2>📦 Productos del Pedido</h2>
                <table className={styleDetails.table}>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.products.map((p, i) => (
                            <tr key={i}>
                                {/* {code && String(code).slice(-4)} */}
                                <td>{p.code && String(p.code).slice(-4)}</td>
                                <td>{p.name}</td>
                                <td>{p.quantity}</td>
                                <td>${parseFloat(p.price_at_purchase).toLocaleString("es-AR")}</td>
                                <td>
                                    $
                                    {(
                                        parseFloat(p.price_at_purchase) * parseFloat(p.quantity)
                                    ).toLocaleString("es-AR")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styleDetails.summary}>
                    <div className={styleDetails.card}>
                        <h4>Total</h4>
                        <p>${parseFloat(order.total).toLocaleString("es-AR")}</p>
                    </div>
                    <div className={styleDetails.card}>
                        <h4>Ganancia Bruta</h4>
                        <p>${parseFloat(order.gross_profit).toLocaleString("es-AR")}</p>
                    </div>
                    {order.debt > 0 && <div className={styleDetails.card}>
                        <h4>Deuda</h4>
                        <p
                            className={
                                parseFloat(order.debt) < 0
                                    ? styleDetails.positive
                                    : styleDetails.negative
                            }
                        >
                            ${parseFloat(order.debt).toLocaleString("es-AR")}
                        </p>
                    </div>}
                    <div className={styleDetails.card}>
                        <h4>Recargo</h4>
                        <p>${order.surcharge}</p>
                    </div>
                    <div className={styleDetails.card}>
                        <h4>Monto Entregado</h4>
                        <p>${parseFloat(order.delivery_amount).toLocaleString("es-AR")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
