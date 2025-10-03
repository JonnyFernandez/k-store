import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useProd } from "../../context/ProdContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import p from './OrderUpdate.module.css'


const OrderUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const { getOrdersById, updateOrder, orderDetail: order } = useProd();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        (async () => {
            try {
                await getOrdersById(id);
            } catch (error) {
                console.error("Error fetching order data:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "Servidor desconectado. Contacta al soporte técnico.",
                    footer: "Soporte técnico: arcancode@gmail.com",
                });
            }
        })();
    }, []);

    // Prellenar formulario cuando se cargan los datos
    useEffect(() => {
        if (order) {
            reset({

                bank_account: order.bank_account,
                clientCuit: order.clientCuit,
                clientInvoice: order.clientInvoice,
                clientName: order.clientName,
                clientReview: order.clientReview,
                clientTelephon: order.clientTelephon,
                // delivery_amount: order.delivery_amount,
                payment_method: order.payment_method,
            });
        }
    }, [order]);

    const onSubmit = async (data) => {
        let oldMonut = Number(order.delivery_amount)
        let newMonut = Number(data.delivery_amount)

        data.delivery_amount = oldMonut + newMonut

        try {
            const aux = await updateOrder(id, data);
            if (aux.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Orden actualizada",
                    text: "La orden fue modificada correctamente.",
                });

            }
            navigate(`/order-detail/${id}`)
            // console.log(aux);


        } catch (error) {
            console.error("Error al actualizar la orden:", error);
            Swal.fire({
                icon: "error",
                title: "Error al actualizar",
                text: "Ocurrió un error. Contacta al soporte.",
            });
        }
    };

    if (!order) return <p>Cargando orden...</p>;

    // console.log(order);


    return (
        <div className={p.orderUpdate}>
            <div className={p.updateContainer}>
                <NavLink to={`/order-detail/${id}`} className={p.backToOrder}>Back</NavLink>
                <h1>Editar Orden {order.code}</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Nombre del Cliente</label>
                    <input {...register("clientName", { required: true })} />
                    {errors.clientName && <p>Este campo es obligatorio</p>}

                    <label>CUIT</label>
                    <input {...register("clientCuit")} />

                    <label>Teléfono del Cliente</label>
                    <input {...register("clientTelephon")} />

                    <label>Comentario del Cliente</label>
                    <textarea {...register("clientReview")} />





                    <div className={p.pepeContainer}>
                        <label>Factura del Cliente:
                            <select {...register("clientInvoice", { required: true })}>
                                <option value="true">Si</option>
                                <option value="false">No</option>
                            </select>
                        </label>


                        <label>Deuda:
                            {
                                order.debt > 0 ? <span className={p.debtMessage}>Deuda: ${order.debt}</span> : <span className={p.cleanDebt}>Sin Deudas</span>
                            }


                        </label>

                        <label>Método de Pago:
                            <select {...register("payment_method", { required: true })}>
                                <option value="cash">Efectivo</option>
                                <option value="electronic">Electrónico</option>
                                <option value="card"> Debt / Cred </option>
                            </select>
                        </label>


                        {
                            order.debt > 0 ? <label>Monto de Entrega:
                                <input type="number" step="0.01" {...register("delivery_amount")} />
                            </label> : <></>
                        }

                    </div>



                    <button type="submit">Actualizar Orden</button>
                </form>
            </div>
        </div>
    );
};

export default OrderUpdate;
