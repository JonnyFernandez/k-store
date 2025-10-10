import { useState, useEffect } from 'react'
import Swal from "sweetalert2";
import { FaRegTrashAlt, FaCopy } from "react-icons/fa";
import LS from './Home.module.css'
import { codeGenerator, idGenerator } from '../../utils/genetareCode';
import { FormManualProd, PaymentMethod, SideBar } from '../../components'
import generarPDF from "../../utils/generatePDF";
import moment from 'moment';
import { getProducts, createOrder } from '../../api/product';
import { Menu } from "lucide-react";



const Home = () => {


    const [prod, setProd] = useState(null)

    const fetchData = async () => {
        const aux = await getProducts();
        setProd(aux.data)
    };

    useEffect(() => {
        fetchData()
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
    console.log(cart.products);

    const [manualProd, setManualProd] = useState({
        id: idGenerator(),
        code: idGenerator(),
        name: '',
        discountedPrice: 0,
        profit_amount: 0,
        quantity: 0
    });

    const today = moment().format("YYYY-MM-DD");
    const [showManualAdd, setShowManualAdd] = useState(false);
    const [payment, setPayment] = useState('cash');
    const [surcharge, setSurcharge] = useState(10);
    const [deliveryAmount, setDeliveryAmount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Estado inicial con la fecha actual
    const [newDate, setNewDate] = useState(today);

    const [pausedProducts, setPausedProducts] = useState([]);

    const togglePauseProduct = (productId) => {
        setPausedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };


    let textShoyMethod = payment === 'cash' ? 'Efectivo' : payment === 'card' ? 'Tarjeta' : 'Transferencia / QR';


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
    const addProductToCart = (id, code, name, discountedPrice, profit_amount, quantity = 1) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.products.find((product) => product.id === id);

            const updatedProducts = existingProduct
                ? prevCart.products.map((product) =>
                    product.id === id
                        ? { ...product, quantity: product.quantity + quantity }
                        : product
                )
                : [...prevCart.products, { id, code, name, discountedPrice, profit_amount, quantity }];


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
                product.discountedPrice,
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

    // const client = {
    //     name: "pepe",
    //     cuit: "20941018646",
    //     phone: '5047727',
    //     review: "hola pendejo"

    // }

    const createPDF = () => generarPDF(cart.products, undefined, undefined, surcharge);

    const productosFiltrados = cart.products.filter(prod => !prod.id.toString().includes("x"));

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

    // Excluye los productos pausados del cálculo
    const totalMount = cart.products.reduce((sum, product) => {
        const isPaused = pausedProducts.includes(product.id); // ← chequea si el producto está pausado
        if (isPaused) return sum; // si está pausado, no se suma

        return sum + product.quantity * product.discountedPrice;
    }, 0);

    // Mantén tu lógica de recargos igual
    const total = totalMount * (1 + surcharge / 100);
    const appliedSurchage = totalMount * (surcharge / 100);




    const data = {
        "orderData": {
            "code": codeGenerator(),
            "date": newDate,
            "surcharge": surcharge,
            "delivery_amount": deliveryAmount,
            "payment_method": payment,
            "seller": "Vendedor A"
        },
        products: productosFiltrados.map(({ id, quantity, discountedPrice, profit_amount }) => ({ id, quantity, discountedPrice, profit_amount })),
    };
    // console.log(data);
    const clearCart = async () => {
        // Muestra un SweetAlert de confirmación
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esto vaciará tu carrito de compras!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, vaciar carrito',
            cancelButtonText: 'No, cancelar'
        });

        // Si el usuario confirma, vacía el carrito y muestra un mensaje de éxito.
        if (result.isConfirmed) {
            setCart({
                products: [],
            });
            Swal.fire(
                '¡Carrito vaciado!',
                'Tu carrito ha sido vaciado con éxito.',
                'success'
            );
        }
    };




    const sendOrder = async () => {
        if (pausedProducts.length > 0) return alert("Tienes prod pausados")
        try {
            // Muestra un Sweet Alert de carga mientras se procesa la petición.
            Swal.fire({
                title: 'Procesando pedido',
                text: 'Por favor, espera...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const aux = await createOrder(data);

            if (aux.status === 201) {
                // console.log(aux.data);
                setCart({
                    products: [],
                });
                // Muestra un Sweet Alert de éxito.
                Swal.fire({
                    icon: 'success',
                    title: '¡Pedido enviado!',
                    text: 'La orden se ha registrado correctamente.',
                    showConfirmButton: false,
                    timer: 2000 // Se cierra automáticamente después de 2 segundos.
                });
            }
        } catch (error) {
            let textError = error.response.data.message

            Swal.close();

            // Muestra un Sweet Alert de error.
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: textError
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


            <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <div className={LS.selerContainer}>
                <div className={LS.selerLeft}>
                    <div className={LS.selerLeftHeader}>

                        <button
                            onClick={() => setIsOpen(true)}
                            style={{
                                padding: "10px",
                                background: "#111827",
                                color: "#fff",
                                borderRadius: "8px",
                                margin: "1rem",
                                cursor: "pointer",
                                border: "none",
                            }}
                        >
                            <Menu size={22} />
                        </button>
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
                                                <td>
                                                    {product.discount > 0 ? (
                                                        <>
                                                            <span className={LS.originalPrice}>{formatCurrency(product.price)}</span>
                                                            <span className={LS.discountedPrice}>{formatCurrency(product.discountedPrice)}</span>
                                                        </>
                                                    ) : (
                                                        formatCurrency(product.price)
                                                    )}
                                                </td>

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
                                    cart.products.slice().reverse().map((product, index) => {
                                        const isPaused = pausedProducts.includes(product.id);
                                        const priceToShow = product.discount > 0 ? product.discountedPrice : product.discountedPrice;
                                        const subtotal = isPaused ? 0 : product.quantity * priceToShow;

                                        return (
                                            <tr key={product.id} className={isPaused ? LS.pausedRow : ""}>
                                                <td>{index + 1}</td>
                                                <td>{String(product.code).slice(-4)}</td>
                                                <td>{product.name}</td>
                                                <td className={LS.inputQuanty}>
                                                    <input
                                                        type="number"
                                                        step="0.25"
                                                        min="0.25"
                                                        value={product.quantity}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            updateProductQuantity(product.id, Number.isNaN(value) ? 0 : value);
                                                        }}
                                                        disabled={isPaused}
                                                    />
                                                </td>
                                                <td>
                                                    {product.discount > 0 ? (
                                                        <>
                                                            <span className={LS.originalPrice}>{formatCurrency(product.discountedPrice)}</span>
                                                            <span className={LS.discountedPrice}>{formatCurrency(product.discountedPrice * (1 + surcharge / 100))}</span>
                                                        </>
                                                    ) : (
                                                        formatCurrency(product.discountedPrice * (1 + surcharge / 100))
                                                    )}
                                                </td>
                                                <td>{formatCurrency(subtotal * (1 + surcharge / 100))}</td>
                                                <td className={LS.actions}>
                                                    <button
                                                        className={`${LS.pauseButton} ${isPaused ? LS.paused : ""}`}
                                                        onClick={() => togglePauseProduct(product.id)}
                                                    >
                                                        {isPaused ? "Reactivar" : "Pausar"}
                                                    </button>
                                                    <button
                                                        className={LS.deleteButton}
                                                        onClick={() => removeProductFromCart(product.id)}
                                                    >
                                                        <FaRegTrashAlt size={15} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className={LS.emptyCartMessage}>Carrito vacío</td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                    {pausedProducts.length > 0 && (
                        <p style={{ color: "#facc15", fontWeight: "bold" }}>
                            ⚠ Hay {pausedProducts.length} producto(s) pausado(s) — no se incluyen en el total.
                        </p>
                    )}
                    <div className={LS.selerLeftCleint}>
                        {<PaymentMethod payment={payment} setPayment={setPayment} />}
                    </div>


                </div>
                <div className={LS[moneyColor()]}>

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

                        {appliedSurchage > 0 && <h6>Recargo: {formatCurrency(appliedSurchage)}</h6>}
                    </div>
                    <div className={LS.checkboxDivHome}>
                        <p >{textShoyMethod}</p>
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

                    <div className={LS.facturaComp}>
                        <button className={LS.facture} onClick={createPDF}>Comprobante</button>
                        <button className={LS.facture2} onClick={clearCart}>Vaciar carrito</button>
                        <button className={LS.refresProd} onClick={fetchData}>Refresh</button>
                        <button className={LS.addManual} onClick={showManual}>Agregar manual</button>
                    </div>
                    {deliveryAmount !== 0 && <button className={LS.facture0} onClick={sendOrder}>Finalizar</button>}

                </div>
            </div>

            <div className={LS.selerFooter}>

                <label htmlFor="">Fecha:

                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                    />
                </label>
            </div>

        </div>
    )
}

export default Home