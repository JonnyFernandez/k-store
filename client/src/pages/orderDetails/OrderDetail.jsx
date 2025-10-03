import orderStyle from './OrderDetail.module.css';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useProd } from '../../context/ProdContext';
import { useAuth } from '../../context/AuthContext';
import generarPDF from '../../utils/generatePDF';
import moment from 'moment';

const OrderDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getOrdersById, orderDetail: order, cancelOrder, deleteOrder } = useProd();
    const { user } = useAuth();
    // Verifica si el usuario tiene permisos para ver esta página   
    const [count, setCount] = useState(0);



    const fetchData = async () => {
        try {
            await getOrdersById(id);
        } catch (error) {
            console.error('Error fetching order data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Servidor desconectado. Contacta al soporte técnico.',
                footer: 'Soporte técnico:',
            });
        }
    };
    useEffect(() => {
        if (user?.type !== 'admin') {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'No tienes permiso para acceder a esta página.',
                footer: 'Soporte técnico:'
            })
            navigate('/catalog');
        }

        fetchData();
    }, [id, count, navigate, user?.type]);




    if (!order) {
        return <p className={orderStyle.notFound}>Orden no encontrada.</p>;
    }

    if (!order || !Array.isArray(order.product)) {
        return <p>Cargando detalles de la orden...</p>;
    }

    const {
        code,
        date,
        discount,
        surcharge,
        total,
        payment_method,
        status,
        gross_profit,
        clientName,
        clientCuit,
        clientInvoice,
        clientTelephon,
        clientReview,
        bank_acount,
        debt,
        product
    } = order;

    // console.log(product);

    const client = {
        "name": clientName,
        "cuit": clientCuit,
        "phone": clientTelephon,
        "review": clientReview,
    }
    // console.log(product);


    const totalMountProduct = product.reduce(
        (sum, product) => sum + product.quantity * product.price,
        0
    );

    // Si hay diferencia con el total, agregás el producto extra
    if (total > totalMountProduct + 5) {
        product.push({
            name: 'AGREGADOS',
            quantity: 1,
            price: total - totalMountProduct
        });
    }

    const handleAction = async (action, successMessage, navigatePath) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Una vez ${action === cancelOrder ? 'cancelada' : 'eliminada'} esta orden, no podrás reanudarla.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Sí, ${action === cancelOrder ? 'cancelar' : 'eliminar'}`,
            cancelButtonText: 'No, regresar',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await action(id);
                await Swal.fire({
                    title: successMessage,
                    text: `La orden ha sido ${action === cancelOrder ? 'cancelada' : 'eliminada'} correctamente.`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                action === deleteOrder ? navigate(navigatePath) : setCount(prev => prev + 1);
            } catch {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo completar la acción. Inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    const formatISODate = (date) => {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    };

    const fecha = formatISODate(date);  // Resultado: "05/06/2025"

    // console.log(fecha);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(value);
    };


    return (
        <div className={orderStyle.container}>
            <div className={orderStyle.title}>
                <NavLink to={`/sales-report/`} className={orderStyle.updateButton}>Back</NavLink>
                <h1>#{code}</h1>
            </div>

            <div className={orderStyle.headerDetail}>
                <div className={orderStyle.card}>
                    <h2 className={orderStyle.subtitle}>📦 Información de la Orden</h2>

                    <div className={orderStyle.blockItems}>
                        <p><strong>Fecha:</strong> {moment(date).format("DD/MM/YYYY")}</p>
                        <p><strong>Estado:</strong> {status}</p>
                    </div>
                    <div className={orderStyle.blockItems}>
                        <p><strong>Método de Pago:</strong> {payment_method === 'cash' ? 'Efectivo' : payment_method === 'electronic' ? 'Trasf / QR' : payment_method === 'card' ? 'Debito / Credito' : ''}</p>
                        <p><strong>Total:</strong> {formatCurrency(total)}</p>
                    </div>
                    <div className={orderStyle.blockItems}>
                        {discount > 0 && <p><strong>Descuento:</strong> {discount}%</p>}
                        {surcharge > 0 && <p><strong>Recargo:</strong> {surcharge}%</p>}
                    </div>
                    <div className={orderStyle.blockItems}>
                        {user?.type === 'admin' && <p><strong>Ganancia:</strong> {formatCurrency(gross_profit)}</p>}

                        <p><strong>CB:</strong> {bank_acount}</p>

                        {Number(debt) > 0 && (
                            <p className={orderStyle.debtWarning}><strong>Deuda:</strong> {formatCurrency(debt)} </p>
                        )}
                    </div>


                </div>

                <div className={orderStyle.card}>
                    <h2 className={orderStyle.subtitle}>👤 Información del Cliente</h2>
                    <div className={orderStyle.blockItems}>
                        <p><strong>Nombre:</strong> {clientName}</p>
                        <p><strong>CUIT:</strong> {clientCuit}</p>
                    </div>
                    <div className={orderStyle.blockItems}>
                        <p><strong>Teléfono:</strong> {clientTelephon}</p>
                        {/* <p><strong>Factura:</strong> {clientInvoice ? "✔️" : "✖️"}</p> */}
                        <p><strong>Reseña:</strong> {clientReview || "Sin reseña"}</p>
                    </div>


                    {/* <p><strong>Cuenta Bancaria:</strong> {bank_acount}</p> */}
                </div>
            </div>

            <div className={orderStyle.cardDown}>
                <h2 className={orderStyle.subtitle}>🛒 Productos Vendidos</h2>
                {product?.length > 0 ? (
                    <div className={orderStyle.productsContainer}>
                        <table className={orderStyle.productTable}>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((prod) => (
                                    <tr key={prod.id || prod.name}>
                                        <td>{prod.name}</td>
                                        <td>{prod.quantity}</td>
                                        <td>{formatCurrency(prod.price)}</td>
                                        <td>{formatCurrency(prod.quantity * prod.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No hay productos asociados a esta orden.</p>
                )}
            </div>

            <div className={orderStyle.updateOrders}>
                <NavLink to={`/order-update/${id}`} className={orderStyle.updateButton}>Actualizar</NavLink>
                {status !== 'Cancelado' && (
                    <button className={orderStyle.cancelOrders} onClick={() => handleAction(cancelOrder, 'Orden cancelada')}>Cancelar</button>
                )}
                {status === 'Cancelado' && (
                    <button className={orderStyle.deleteOrders} onClick={() => handleAction(deleteOrder, 'Orden eliminada', '/sales-report')}>Eliminar</button>
                )}
                <button className={orderStyle.exportPDF} onClick={() => generarPDF(product, client, fecha)}>Exportar PDF</button>
            </div>
        </div>
    );

};

export default OrderDetail;
