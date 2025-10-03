import React from "react";
import "./FormManualProd.css";
import Swal from "sweetalert2";


const FormManualProd = ({ manualProd, setManualProd, showManual, addProdToCart }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setManualProd((prev) => ({
            ...prev,
            [name]: name === "price" || name === "quantity" ? Number(value) : value,
        }));
    };



    const sendProd = () => {
        const { name, price, quantity } = manualProd;

        if (!name || price <= 0 || quantity <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor, completá el nombre, precio y cantidad del producto.",
                confirmButtonColor: "#3085d6",
                background: "#1e1e2f",
                color: "#f0f0f0",
            });
            return;
        }

        addProdToCart()

        Swal.fire({
            icon: "success",
            title: "Producto agregado",
            text: `${manualProd.name} fue agregado al carrito.`,
            confirmButtonColor: "#4caf50",
            background: "#1e1e2f",
            color: "#f0f0f0",
            timer: 1500,
            showConfirmButton: false,
        });
        setManualProd({
            ...manualProd,
            name: '',
            price: 0,
            profit_amount: 0,
            quantity: 0
        })
    }


    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="close-add-prod" onClick={showManual}>X</button>
                <form className="form" onSubmit={(e) => { sendProd(); }}>

                    <h2>Agregar producto manual</h2>

                    <label className="label-add-prod" htmlFor="">Nombre:
                        <input
                            type="text"
                            name="name"
                            value={manualProd.name}
                            onChange={handleChange}
                            placeholder="Nombre del producto"
                            // required
                            className="form-input"
                        />
                    </label>
                    <label className="label-add-prod" htmlFor="">Precio:
                        <input
                            type="number"
                            name="price"
                            value={manualProd.price}
                            onChange={handleChange}
                            placeholder="Precio"
                            // required
                            step="0.01"
                            min={0}
                            className="form-input"
                        />
                    </label>
                    <label className="label-add-prod" htmlFor="">Cantidad:
                        <input
                            type="number"
                            name="quantity"
                            value={manualProd.quantity}
                            onChange={handleChange}
                            placeholder="Cantidad"
                            // required
                            className="form-input"
                        />
                    </label>
                    <button type="submit" className="form-button">Agregar producto</button>
                </form>
            </div>
        </div>
    );
};

export default FormManualProd;
