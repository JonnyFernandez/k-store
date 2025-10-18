import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder, deleteOrder } from "../../api/product";
import { Nav } from "../../components";
import styleDetails from "./OrderDetails.module.css";
import Swal from "sweetalert2";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [moreMoney, setMoreMoney] = useState(0)
    const [count, setCount] = useState(0)
    // console.log(order.delivery_amount);


    const handleMoney = (money) => {
        setMoreMoney(money)
    }

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
    }, [id, count]);

    if (loading) return <p className={styleDetails.loading}>Cargando pedido...</p>;
    if (!order) return <p className={styleDetails.error}>No se encontró el pedido.</p>;

    const goBack = () => {
        navigate('/reporte-ventas')
    }
    const removeOrder = async () => {
        try {
            const confirmResult = await Swal.fire({
                title: "¿Eliminar esta orden?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (!confirmResult.isConfirmed) return; // Si cancela, no hace nada

            const aux = await deleteOrder(order.id);

            if (aux.status === 200 || aux.status === 201) {
                await Swal.fire({
                    title: "Orden eliminada",
                    text: "La orden fue eliminada y el stock restaurado.",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                });

                navigate("/reporte-ventas");
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo eliminar la orden.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "Ocurrió un problema al eliminar la orden.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };


    const updateMoney = async () => {
        let sumatory = parseFloat(order.delivery_amount) + parseFloat(moreMoney)
        const data = { "delivery_amount": sumatory }
        const aux = await updateOrder(order.id, data)
        if (aux.status === 200 || aux.status === 201) {
            setCount(prev => prev + 1)
        }


    }

    return (
        <div className={styleDetails.details}>
            <Nav />
            <div className={styleDetails.detailsContainer}>
                <button className={styleDetails.back} onClick={goBack}>Volver</button>
                <button className={styleDetails.delete} onClick={removeOrder}>Eliminar</button>





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
                        <p>%{order.surcharge}</p>
                    </div>
                    {order.debt > 0 && <div className={styleDetails.card}>
                        <h4>Monto Entregado</h4>
                        <p>${parseFloat(order.delivery_amount).toLocaleString("es-AR")}</p>
                        <input type="text"
                            className={styleDetails.inputMoney}
                            value={moreMoney}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                handleMoney(Number.isNaN(value) ? 0 : value)
                            }} />
                        <button className={styleDetails.back} onClick={updateMoney}>Actualizar</button>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
