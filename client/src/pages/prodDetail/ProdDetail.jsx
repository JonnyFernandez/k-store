import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { api_prod_details, update_prod_status, api_prod_delete, api_featured_prod, api_offer_prod } from "../../api/product";
import styles from "./ProdDetail.module.css";
import { useAuth } from "../../context/AuthContext";

const ProdDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth()
    const [product, setProduct] = useState(null);



    const defaultImage = 'https://i.pinimg.com/736x/eb/7d/c8/eb7dc8064bc6355d66ef6183db7c2a6d.jpg'
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api_prod_details(id);
                setProduct(response.data);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: error.response?.data?.message || "Error desconocido",
                    footer: "Soporte técnico: arcancode@gmail.com",
                });
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) {
        return <div className={styles.loader}>Cargando...</div>;
    }

    const toggleStatus = async () => {
        try {
            await update_prod_status(id);
            setProduct((prev) => ({ ...prev, isActive: !prev.isActive }));
            Swal.fire({
                icon: "success",
                title: "Estado actualizado",
                text: product.isActive ? "Producto pausado" : "Producto reactivado",
            });
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el estado." });
        }
    };

    const toggleFeatured = async () => {
        try {
            await api_featured_prod(id);
            setProduct((prev) => ({ ...prev, isFeatured: !prev.isFeatured }));
            Swal.fire({
                icon: "success",
                title: "Estado actualizado",
                text: product.isFeatured ? "Producto destacado" : "Producto no destacado",
            });
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el estado." });
        }
    };
    // --------------------------------------------------------------------------------------------------------------------------------------
    const toggleOffer = async () => {
        try {
            await api_offer_prod(id);
            setProduct((prev) => ({ ...prev, offer: !prev.offer }));
            Swal.fire({
                icon: "success",
                title: "Estado actualizado",
                text: product.offer ? "Producto Ofertado" : "Producto no Ofertado",
            });
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el estado." });
        }
    };

    const deleteProduct = async () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api_prod_delete(id);
                    Swal.fire("Eliminado", "El producto ha sido eliminado.", "success").then(() => navigate("/catalog"));
                } catch {
                    Swal.fire("Error", "No se pudo eliminar el producto.", "error");
                }
            }
        });
    };

    return (
        <div className={`${styles.productDetail} ${product.isActive ? styles.active : styles.inactive} ${product.isFeatured && product.isActive ? styles.featured : ""}`}>
            <div className={styles.headerDetail}>
                {/* <NavLink to="/catalog" className={styles.backLink}>Volver</NavLink> */}
                <h2>{product.name}</h2>
            </div>

            <div className={styles.infoContainer}>
                <div className={styles.divLeft}>
                    <div className={styles.imageContainer}>
                        {<img src={product.image ? product.image : defaultImage} alt={product.name} />}
                    </div>
                    {user.type === 'admin' ? <div className={styles.actionsContainer}>
                        <NavLink to={`/prod-edit/${id}`}><button className={styles.editButton}>Editar</button></NavLink>
                        <button className={styles.pauseButton} onClick={toggleStatus}>{product.isActive ? "Pausar" : "Reactivar"}</button>
                        <button className={styles.featuredButton} onClick={toggleFeatured}>{product.isFeatured ? "Quitar Destacado" : "Destacar"}</button>
                        <button className={styles.offerButton} onClick={toggleOffer}>{product.offer ? "No Ofertar" : "Oferta"}</button>
                        <button className={styles.deleteButton} onClick={deleteProduct}>Eliminar</button>
                    </div> : ''}

                </div>

                <div className={styles.divRight}>
                    <div className={styles.infoInside}>
                        <p><strong>Descripción:</strong> {product.description}</p>
                        <b>Precio: ${Number(product.price)?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
                        {/* <strong>${Number(product.price)?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> */}


                        <p><strong>Codigo:</strong> {product.code}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <p><strong>Destacado:</strong> {product.isFeatured ? "Sí ✔️" : "No ✖️"}</p>
                        <p><strong>Oferta:</strong> {product.offer ? "Sí ✔️" : "No ✖️"}</p>
                        <p><strong>Activo:</strong> {product.isActive ? "Sí ✔️" : "No ✖️"}</p>
                        {user.type === 'admin' ? <div className={styles.actionsContainer}>
                            <hr />
                            <b>Costo: $ {Number(product.cost)?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
                            <b>Porcentaje: {Number(product.profit)?.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%</b>
                            <b>Ganancia: $ {Number(product.profit_amount)?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>


                            <p> <b>Categoria/s:</b> </p>
                            {
                                product.category ? <div className={styles.itemsChar}>
                                    <p>{product.category}</p>
                                </div> : 'Sin Categoria'
                            }
                            <p> <b>Proveedor/es:</b> </p>
                            {
                                product.provider ? <div className={styles.itemsChar}>
                                    <p>{product.provider}</p>
                                </div> : 'No agregados'
                            }

                        </div> : ''}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProdDetail;
