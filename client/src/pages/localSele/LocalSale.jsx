import { useState, useEffect } from 'react'
import Swal from "sweetalert2";
import { FaRegTrashAlt } from "react-icons/fa";
import LS from './LocalSale.module.css'
import { useProd } from "../../context/ProdContext";
import { codeGenerator, idGenerator } from '../../utils/genetareCode';
import { FormManualProd, Modal } from '../../components'
import generarPDF from "../../utils/generatePDF";
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';
import logo from '../../assets/logo3.png'
import { api_create_order } from '../../api/product';
import { FaCopy } from 'react-icons/fa';
import { PaymentMethod } from '../../components';





const LocalSale = () => {
    const { allProduct, prod, errors: OrderErrors } = useProd()
    const { user } = useAuth()


    const currentDate = new Date().toISOString().split('T')[0];


    const fetchData = async () => {
        await allProduct();

    };
    // console.log(prod);

    useEffect(() => {
        if (!prod) {
            fetchData()
        };
    }, []);



    const [searchQuery, setSearchQuery] = useState('')
    const [copied, setCopied] = useState(false);




    const products = prod || [];

    // Filtrar productos por nombre o código
    const filteredProducts = products.filter(({ name, code }) => {
        const query = searchQuery.trim().toLowerCase(); // eliminamos espacios y pasamos a minúsculas
        return [name, code].some(field => field?.toLowerCase().includes(query));
    });


    const [cart, setCart] = useState(() => {
        const savedProducts = localStorage.getItem("products");
        return {
            products: savedProducts ? JSON.parse(savedProducts) : [],
        };
    });

    const [manualProd, setManualProd] = useState({
        id: idGenerator(),
        code: idGenerator(),
        name: '',
        price: 0,
        profit_amount: 0,
        quantity: 0
    });


    const [showManualAdd, setShowManualAdd] = useState(false);

    const [payment, setPayment] = useState('cash');
    const [discount, setDiscount] = useState(0);
    const [surcharge, setSurcharge] = useState(10);
    const [deliveryAmount, setDeliveryAmount] = useState(0);
    const [bank, setBank] = useState(true);



    const getInitialClientInput = () => ({
        clientName: JSON.parse(localStorage.getItem("name") || '""'),
        clientCuit: JSON.parse(localStorage.getItem("cuit") || '""'),
        clientTelephon: JSON.parse(localStorage.getItem("telephon") || '""'),
        clientReview: JSON.parse(localStorage.getItem("review") || '""'),
    });

    const [clientInput, setClientInput] = useState(getInitialClientInput);
    let textShoyMethod = payment === 'cash' ? 'Efectivo' : payment === 'card' ? 'Tarjeta' : 'Transferencia / QR';
    let textBank = bank ? 'jonny' : 'dorca';


    // Sincroniza con localStorage al cambiar clientInput
    useEffect(() => {
        localStorage.setItem("name", JSON.stringify(clientInput.clientName));
        localStorage.setItem("cuit", JSON.stringify(clientInput.clientCuit));
        localStorage.setItem("telephon", JSON.stringify(clientInput.clientTelephon));
        localStorage.setItem("review", JSON.stringify(clientInput.clientReview));
    }, [clientInput]);




    const handleClient = (event) => {
        const { name, value } = event.target;
        setClientInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const showManual = () => setShowManualAdd(prev => !prev)

    const addProdToCart = () => {
        setCart((prevCart) => ({
            ...prevCart,
            products: [...prevCart.products, manualProd],
        }));
    }

    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(cart.products));
    }, [cart.products]);

    // Add product to cart
    const addProductToCart = (id, code, name, price, profit_amount, quantity = 1) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.products.find((product) => product.id === id);

            const updatedProducts = existingProduct
                ? prevCart.products.map((product) =>
                    product.id === id
                        ? { ...product, quantity: product.quantity + quantity }
                        : product
                )
                : [...prevCart.products, { id, code, name, price, profit_amount, quantity }];


            return {
                ...prevCart,
                products: updatedProducts,

            };
        });
    };
    // Remove product from cart
    const removeProductFromCart = (id) => {
        setCart((prevCart) => {
            const updatedProducts = prevCart.products.filter((product) => product.id !== id);
            return {
                ...prevCart,
                products: updatedProducts,

            };
        });
    };

    const handleBarcodeScan = (barcode) => {
        const product = products.find((prod) => prod.code.includes(barcode));

        if (!product) {
            alert("El código escaneado no corresponde a ningún producto.")
        } else if (product.isActive === false) {
            alert(`El producto "${product.name}" pausado por el admin.`)
            return
        } else if (product.stock < 1) {
            alert(alert(`El producto "${product.name}" no tiene stock disponible.`))
            return;
        }

        // Verificar si ya está en el carrito y controlar el stock
        const existingItem = cart.products.find((item) => item.code === product.code);

        if (existingItem && existingItem.quantity + 1 > product.stock) {
            alert(`No puedes agregar más de ${product.stock} unidades del producto "${product.name}".`,)
        } else {
            // Agregar producto al carrito
            addProductToCart(
                product.id,
                product.code,
                product.name,
                product.price,
                product.profit_amount
            );

        }

    };

    //    agregar productos manualmente desde el input
    const addToCart = (id) => {
        const product = filteredProducts.find((p) => p.id === id);
        if (!product) return; // Verifica que el producto existe.

        if (product.isActive === false) {
            Swal.fire({
                icon: "error",
                title: "Producto Pausado",
                text: `El producto "${product.name}" pausado por el admin o no tiene stock.`,
            });
            return;
            // return alert(`El producto "${product.name}" pausado por el admin.`)
        }


        const existingItem = cart.products.find((item) => item.id === product.id);

        // Si el producto ya está en el carrito
        if (existingItem) {
            if (existingItem && existingItem.quantity + 1 > product.stock) {
                // alert(`Solo puedes agregar hasta ${product.stock} unidades de este producto.`)
                Swal.fire({
                    icon: "error",
                    title: "Límite de Stock",
                    text: `Solo puedes agregar hasta ${product.stock} unidades de este producto.`,
                });
                return;
            }
            // Incrementa la cantidad
            setCart((prevCart) => ({
                ...prevCart,
                products: prevCart.products.map((item) =>
                    item.code === product.code
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            }));
        } else {
            // Si el producto no está en el carrito
            if (product.stock < 1) {
                alert("Este producto está fuera de stock.");
                return;
            }
            setCart((prevCart) => ({
                ...prevCart,
                products: [...prevCart.products, { ...product, quantity: 1 }],
            }));
        }
        setSearchQuery('')
    };

    const client = {
        "name": clientInput.clientName,
        "cuit": clientInput.clientCuit,
        "phone": clientInput.clientTelephon,
        "review": clientInput.clientReview,
    }

    const createPDF = () => generarPDF(cart.products, client)
    const productosFiltrados = cart.products.filter(prod => !prod.id.toString().includes("x"));

    const calculateProfitTotal = () =>
        productosFiltrados.reduce(
            (total, product) =>
                total + (product.profit_amount ? product.quantity * product.profit_amount : 0),
            0
        );


    const updateProductQuantity = (id, newQuantity) => {
        setCart((prevCart) => {
            const updatedProducts = prevCart.products.map((product) =>
                product.id === id
                    ? { ...product, quantity: Math.max(parseFloat(newQuantity), 0) }
                    : product
            );
            return {
                ...prevCart,
                products: updatedProducts,

            };
        });
    };

    const totalMount = cart.products.reduce(
        (sum, product) => sum + product.quantity * product.price,
        0
    );

    let total = (totalMount * (1 - (discount / 100) + (surcharge / 100)))
    let appliedDiscount = totalMount * discount / 100
    let appliedSurchage = totalMount * surcharge / 100


    useEffect(() => {
        if (payment === 'electronic') {
            setDeliveryAmount(total)
        }

    }, [])



    const data = {
        "code": codeGenerator(),
        "discount": discount,
        "surcharge": surcharge,
        "total": total,
        "payment_method": payment,
        "bank_acount": textBank,
        "products": productosFiltrados.map(({ id, quantity, price }) => ({ id, quantity, price })),
        "date": currentDate,
        "delivery_amount": payment === 'card' ? total : payment === 'electronic' ? total : deliveryAmount,
        "gross_profit": calculateProfitTotal(),
        "clientName": clientInput.clientName,
        "clientInvoice": payment === 'card' || payment === 'electronic' ? true : false,
        "clientCuit": clientInput.clientCuit,
        "clientTelephon": clientInput.clientTelephon,
        "clientReview": clientInput.clientReview,
        "seller": user.name

    };

    // Clear the cart
    const clearCart = () => {

        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción vaciará todo el carrito. No podrás deshacerla.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, vaciar carrito",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                setCart({
                    products: [],
                });
                setClientInput({
                    clientName: "",
                    clientCuit: "",
                    clientTelephon: "",
                    clientReview: "",
                });

                setSurcharge(0)
                setDiscount(0)
                setDeliveryAmount(0)
                setPayment("cash")

                Swal.fire(
                    "Carrito vacío",
                    "El carrito ha sido vaciado exitosamente.",
                    "success"
                );
            }
        });
    };



    const sendOrder = async () => {
        if (cart.products.length === 0) {
            return Swal.fire({
                icon: 'warning',
                title: 'Carrito vacío',
                text: 'Agrega al menos un producto antes de confirmar el pedido.',
            });
        }

        if (payment === 'cash' && deliveryAmount === 0) {
            return Swal.fire({
                icon: 'warning',
                title: 'Monto de pago requerido',
                text: 'Debes ingresar con cuánto paga el cliente.',
            });
        }

        const result = await Swal.fire({
            title: "¿Confirmar pedido?",
            text: "¿Estás seguro de que deseas finalizar este pedido? Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        try {
            let aux = await api_create_order(data);

            setCart({ products: [] });
            setClientInput({
                clientName: "",
                clientCuit: "",
                clientTelephon: "",
                clientReview: "",
            });
            setSurcharge(0);
            setDiscount(0);
            setDeliveryAmount(0);
            setSearchQuery('');
            setPayment("cash");
            setBank(true);

            await Swal.fire({
                icon: 'success',
                title: `Codigo: ${aux.data}`,
                text: 'El pedido se ha enviado correctamente.',
            });

        } catch (error) {
            // console.error(error.response?.data?.message || error.message);

            Swal.fire({
                icon: 'error',
                title: 'Error al crear el pedido',
                text: error.response?.data?.message || 'Ocurrió un error inesperado.',
            });
        }
    };


    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(value);
    };

    const moneyColor = () => {
        switch (payment) {
            case 'cash': return 'colorCash';
            case 'card': return 'colorCard';
            default: return 'colorElectronic';
        }
    };


    return (
        <div className={LS.localSele}>
            {showManualAdd && <FormManualProd manualProd={manualProd} setManualProd={setManualProd} showManual={showManual} addProdToCart={addProdToCart} />}
            <div className={LS.selerContainer}>
                <div className={LS.selerLeft}>
                    <div className={LS.selerLeftHeader}>
                        <input
                            type="text"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleBarcodeScan(e.target.value);
                                    e.target.value = "";
                                }
                            }}
                            placeholder="Escanear código de barras..."
                            className={LS.barCodeInp}
                        />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o código"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={LS.manualInp}
                        />
                        <div className={LS.addManualButtonCont}>
                            <button className={LS.addManualButton} onClick={showManual}>Agregar Manual</button>
                        </div>


                    </div>

                    {/* ----------------------------------------------------------------------------- */}
                    <div className={LS.selerLeftBody}>
                        {
                            searchQuery && (
                                <table className={LS.table}>
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Stock</th>
                                            <th>Precio</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td>{String(product.code).slice(-4)}</td>
                                                <td>{product.name}</td>
                                                <td>{product.stock}</td>
                                                <td>{formatCurrency(product.price)}</td>
                                                <td>
                                                    <button
                                                        className={`${LS.addButton} ${product.stock === 0 || product.isActive === false ? LS.disabledButton : ""}`}
                                                        onClick={() => addToCart(product.id)}
                                                        disabled={product.stock === 0}
                                                    >
                                                        {product.stock === 0 ? "Sin stock" : "Agregar"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        }



                        {/* TABLE 2 */}
                        <table className={LS.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Unitario</th>
                                    <th>Subtotal</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart?.products.length > 0 ? (
                                    cart.products.slice().reverse().map((product, index) => (
                                        <tr key={product.id}>
                                            <td>{index + 1}</td>
                                            <td>{String(product.code).slice(-4)}</td>
                                            <td>{product.name}</td>
                                            <td className={LS.inputQuanty}>
                                                <input
                                                    type="number"
                                                    step="0.25" // Permite valores con decimales
                                                    min="0.25"     // Restringe valores negativos
                                                    value={product.quantity}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value); // Convierte el valor a decimal
                                                        updateProductQuantity(product.id, Number.isNaN(value) ? 0 : value); // Valida si es un número
                                                    }}
                                                />

                                            </td>
                                            <td>{formatCurrency(product.price)}</td>
                                            <td>{formatCurrency(product.quantity * product.price)}</td>
                                            <td>
                                                <button
                                                    className={LS.deleteButton}
                                                    onClick={() => removeProductFromCart(product.id)}
                                                >
                                                    <FaRegTrashAlt size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className={LS.emptyCartMessage}>
                                            Carrito vacío
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>



                        {/* ----------------------------------------------------------------------------- */}


                    </div>

                    {/* Datos del cliente---------------------------------------- */}
                    <div className={LS.selerLeftCleint}>

                        <div className={LS.clientGrid}>
                            <label className={LS.labelCompact}>
                                Nombre del cliente:
                                <input
                                    type="text"
                                    placeholder="Nombre del cliente"
                                    className={LS.inputCompact}
                                    name="clientName"
                                    value={clientInput.clientName}
                                    onChange={handleClient}
                                />
                            </label>
                            <label className={LS.labelCompact}>
                                CUIT:
                                <input
                                    type="text"
                                    placeholder="CUIT"
                                    className={LS.inputCompact}
                                    name="clientCuit"
                                    value={clientInput.clientCuit}
                                    onChange={handleClient}
                                />
                            </label>
                            <label className={LS.labelCompact}>
                                Teléfono:
                                <input
                                    type="text"
                                    placeholder="Teléfono"
                                    className={LS.inputCompact}
                                    name="clientTelephon"
                                    value={clientInput.clientTelephon}
                                    onChange={handleClient}
                                />
                            </label>
                            <label className={LS.labelCompact} >
                                Observaciones:
                                <input
                                    type="text"
                                    placeholder="Observaciones"
                                    className={LS.inputCompact}
                                    name="clientReview"
                                    value={clientInput.clientReview}
                                    onChange={handleClient}
                                />
                            </label>
                        </div>
                    </div>







                    {/* Datos del cliente */}
                </div>
                <div className={LS.selerRight}>
                    {/* ----------------------------------------------------------------------------------------------------------------------------------------------------- */}
                    <div className={LS.headerRightMount}>
                        <h3>
                            Total: {total > 0 ? formatCurrency(total) : '00.00'}

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className={LS.copyBtn}
                                title="Copiar al portapapeles"
                            >
                                <FaCopy size={16} />
                            </button>
                        </h3>

                        {copied && <small className={LS.copyMsg}>¡Copiado!</small>}

                        {appliedDiscount > 0 && <h6>Descuento: {formatCurrency(appliedDiscount)}</h6>}
                        {appliedSurchage > 0 && <h6>Recargo: {formatCurrency(appliedSurchage)}</h6>}
                    </div>


                    <div className={LS.checkboxDivHome}>
                        {/* <p className={LS.textMethod} >{textShoyMethod}</p> */}

                        <p className={LS[moneyColor()]}>{textShoyMethod}</p>
                    </div>


                    <div className={LS.discountAndRecarg}>
                        <div className={LS.inputGroup}>
                            <label htmlFor="recargo">Recargo (%):
                                <input
                                    type="text"
                                    id="recargo"
                                    value={surcharge}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        setSurcharge(Number.isNaN(value) ? 0 : value); // Verifica si es un número válido
                                    }}
                                />
                            </label>

                        </div>
                        {
                            payment === 'cash'
                                ? <div className={LS.inputGroup}>
                                    <label htmlFor="descuento">Descuento (%):
                                        <input
                                            type="text"
                                            id="descuento"
                                            value={discount}
                                            onChange={(e) => {
                                                const value = parseFloat(e.target.value);
                                                setDiscount(Number.isNaN(value) ? 0 : value); // Verifica si es un número válido
                                            }}
                                        />

                                    </label>
                                </div>
                                : ''
                        }

                    </div>

                    <div className={LS.paymentLine}>
                        <div className={LS.inputGroup}>
                            <label htmlFor="pagaCont">Paga con:
                                <input
                                    type="text"
                                    id="pagaCont"
                                    value={deliveryAmount}
                                    className={LS.paymentInput}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        setDeliveryAmount(Number.isNaN(value) ? 0 : value); // Verifica si es un número válido
                                    }}
                                />

                            </label>
                        </div>
                        <div className={LS.changeText}>
                            {
                                deliveryAmount < total
                                    ? <div className={LS.moneyLess}><b>Falta: {formatCurrency(total - deliveryAmount)}</b></div>
                                    : <div className={LS.moneyComplete}>
                                        <b>Cambio: {formatCurrency(deliveryAmount - total)}</b>
                                    </div>
                            }

                        </div>
                    </div>

                    {<PaymentMethod payment={payment} setPayment={setPayment} />}

                    <div className={LS.facturaComp}>
                        <button className={LS.facture} onClick={createPDF}>Comprobante</button>
                        <button className={LS.facture2} onClick={clearCart}>Vaciar carrito</button>
                        <button className={LS.refresProd} onClick={fetchData}>Refres</button>
                    </div>


                    <button className={LS.facture} onClick={sendOrder}>Finalizar</button>





                </div>
            </div>

            <div className={LS.selerFooter}>
                {/* footer */}
                <div> <b>Fecha:</b>  {moment(currentDate).format("DD/MM/YYYY")}</div>
                {/* <div>{currentDate}</div> */}

                <div className={LS.witchcuenta} onClick={() => setBank(prev => !prev)}>{bank ? 'Cuenta: Jonny ' : 'Cuenta: Dorca'}</div>
            </div>

        </div>
    )
}

export default LocalSale