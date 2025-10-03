import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import x from "./Home.module.css";
import moment from "moment";
import { useProd } from "../../context/ProdContext";
import generarPDF from "../../utils/generatePDF";
import { FaMapMarkerAlt, FaChevronLeft, FaArrowLeft, FaWhatsapp, FaEnvelope, FaArrowUp, FaRegTrashAlt } from "react-icons/fa";


const Home = () => {
    const { allProduct, prod, createOrder, errors: OrderErrors, get_distributor, getCategory, distributors, categories } = useProd()

    localStorage.setItem("distributorsDB", JSON.stringify(distributors));
    localStorage.setItem("categoriesDB", JSON.stringify(categories));


    const currentDate = new Date().toISOString().split('T')[0];


    useEffect(() => {
        if (OrderErrors && OrderErrors.length > 0) {
            Swal.fire({
                icon: "error",
                title: "Error en el pedido",
                text: OrderErrors.join(", "), // Muestra los errores concatenados
                footer: "Por favor, verifica la información del pedido.",
            });
        }
    }, [OrderErrors]); // Ejecuta el efecto solo cuando OrderErrors cambie


    const products = prod || [];



    const [cart, setCart] = useState(() => {
        const savedProducts = localStorage.getItem("products");
        return {
            discount: 0,
            total_without_discount: 0,
            total_with_discount: 0,
            paymentMethod: "",
            payment_with: 0,
            res_payment: 0,
            user: "username123",
            products: savedProducts ? JSON.parse(savedProducts) : [],
        };
    });
    // console.log(cart.products);

    const createPDF = () => generarPDF(cart.products)

    // Sincronizar `products` con `localStorage` cada vez que cambie
    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(cart.products));
    }, [cart.products]);

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [account_1, setAccount_1] = useState("dorca");
    // console.log(account_1);

    const [pay, setPay] = useState(0);
    const [showInputs, setShowInputs] = useState(true);
    const [discount, setDiscount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');




    // Fetch products on mount
    const fetchData = async () => {
        try {
            await allProduct();
            await getCategory()
            await get_distributor()

        } catch (error) {
            console.error("Error fetching products:", error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "Servidor desconectado. Por favor, contacta al soporte técnico.",
                footer: 'soporte técnico "arcancode@gmail.com"',
            });
            localStorage.removeItem('user');

            // Eliminar cookies relacionadas con la sesión
            document.cookie.split(";").forEach((cookie) => {
                const [name] = cookie.split("=");
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
            });
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const refresh = () => {
        setSearchQuery('')
        fetchData();
    }

    // Generate unique code for each order
    const generateUniqueCode = () => `ORD-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;


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

            const totalWithoutDiscount = updatedProducts.reduce(
                (sum, product) => sum + product.quantity * product.price,
                0
            );
            const totalWithDiscount = totalWithoutDiscount - prevCart.discount;

            return {
                ...prevCart,
                products: updatedProducts,
                total_without_discount: totalWithoutDiscount,
                total_with_discount: totalWithDiscount,
            };
        });
    };

    // Handle barcode scan
    const handleBarcodeScan = (barcode) => {
        const product = products.find((prod) => prod.code === barcode);
        // if (product.isActive === false) {
        //     return alert("Producto no disponible")

        // }

        if (!product) {
            alert("El código escaneado no corresponde a ningún producto.")
        }

        if (product.isActive === false) {
            alert(`El producto "${product.name}" pausado por el admin.`)
            return
        }



        // Verificar si el producto tiene stock disponible
        if (product.stock < 1) {
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


    // Calculate totals
    const calculateSubTotal = () =>
        cart.products.reduce((total, product) => total + product.quantity * product.price, 0);

    const calculateProfitTotal = () =>
        cart.products.reduce(
            (total, product) =>
                total + (product.profit_amount ? product.quantity * product.profit_amount : 0),
            0
        );

    const calculateTotalWithDiscount = () => {
        const subtotal = calculateSubTotal();
        return subtotal - (subtotal * discount) / 100;
    };

    const calculateTurned = () => {
        const totalWithDiscount = calculateTotalWithDiscount();
        return pay ? pay - totalWithDiscount : 0;
    };

    // Remove product from cart
    const removeProductFromCart = (id) => {
        setCart((prevCart) => {
            const updatedProducts = prevCart.products.filter((product) => product.id !== id);
            const totalWithoutDiscount = updatedProducts.reduce(
                (sum, product) => sum + product.quantity * product.price,
                0
            );
            const totalWithDiscount = totalWithoutDiscount - prevCart.discount;

            return {
                ...prevCart,
                products: updatedProducts,
                total_without_discount: totalWithoutDiscount,
                total_with_discount: totalWithDiscount,
            };
        });
    };


    const handlePaymentMethodChange = (method) => {
        if (method === 'cash') setAccount_1('dorca')
        if (method === 'electronic') {
            setDiscount(0)
            setPay(0)
        }

        setPaymentMethod(method);
        setShowInputs(prev => !prev);
    };
    const handleUserMoney = (method) => {
        setAccount_1(method);
    };




    const updateProductQuantity = (id, newQuantity) => {
        setCart((prevCart) => {
            const updatedProducts = prevCart.products.map((product) =>
                product.id === id
                    ? { ...product, quantity: Math.max(parseFloat(newQuantity), 0) }
                    : product
            );

            const totalWithoutDiscount = updatedProducts.reduce(
                (sum, product) => sum + product.quantity * product.price,
                0
            );
            const totalWithDiscount = totalWithoutDiscount - prevCart.discount;

            return {
                ...prevCart,
                products: updatedProducts,
                total_without_discount: totalWithoutDiscount,
                total_with_discount: totalWithDiscount,
            };
        });
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
                    discount: 0,
                    total_without_discount: 0,
                    total_with_discount: 0,
                    paymentMethod: "",
                    payment_with: 0,
                    res_payment: 0,
                    user: "username123",
                    products: [],
                });

                Swal.fire(
                    "Carrito vacío",
                    "El carrito ha sido vaciado exitosamente.",
                    "success"
                );
            }
        });
    };

    // Filtrar productos por nombre o código
    const filteredProducts = products.filter(({ name, code }) =>
        [name, code].some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const data = {
        "code": generateUniqueCode(),
        "discount": discount,
        "total_without_discount": calculateSubTotal(),
        "total_with_discount": calculateTotalWithDiscount(),
        "payment_method": paymentMethod,
        "payment_with": pay,
        "res_payment": calculateTurned(),
        "user": account_1 || "username123",
        "products": cart.products.map(({ id, quantity, price }) => ({ id, quantity, price })),
        "date": currentDate,
        "total_profit_amount": calculateProfitTotal(),
        "status": "Completed"
    };

    // console.log(data.products);

    //    agregar productos manualmente
    const addToCart = (id) => {
        const product = filteredProducts.find((p) => p.id === id);
        if (product.isActive === false) {
            Swal.fire({
                icon: "error",
                title: "Producto Pausado",
                text: `El producto "${product.name}" pausado por el admin.`,
            });
            return;
            // return alert(`El producto "${product.name}" pausado por el admin.`)
        }

        if (!product) return; // Verifica que el producto existe.

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

    const sendOrder = () => {
        Swal.fire({
            title: "¿Confirmar pedido?",
            text: "¿Estás seguro de que deseas finalizar este pedido? Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Crear el pedido
                createOrder(data);

                // Vaciar el carrito
                setCart({
                    discount: 0,
                    total_without_discount: 0,
                    total_with_discount: 0,
                    paymentMethod: "",
                    payment_with: 0,
                    res_payment: 0,
                    user: "username123",
                    products: [],
                });

                setSearchQuery('')
                // Mostrar mensaje de éxito
                Swal.fire(
                    "Pedido Confirmado",
                    "El pedido se ha enviado correctamente y el carrito ha sido vaciado.",
                    "success"
                );
            }


        });
    };


    return (
        <div className={x.container}>
            <div className={x.header}>
                <button onClick={refresh}>Refresh</button>
                <h1>Sistema de Cobro</h1>
                <span>{moment(currentDate).format("DD/MM/YYYY")}</span>
            </div>
            {
                OrderErrors?.length >= 1 ? OrderErrors?.map((item, i) => <div key={i} className=''>{item}</div>) : ''
            }

            <div className={x.inputContainer}>
                <input
                    type="text"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleBarcodeScan(e.target.value);
                            e.target.value = "";
                        }
                    }}
                    placeholder="Escanear código de barras..."
                    className={x.barCodeInp}
                />
                <input
                    type="text"
                    placeholder="Buscar por nombre o código"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={x.manualInp}
                />
            </div>

            {/* Lista de productos */}
            {searchQuery && (
                <div className={x.tableContainer}>
                    <table className={x.table}>
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
                                    <td>${product.price.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}</td>
                                    <td>
                                        <button
                                            className={`${x.addButton} ${product.stock === 0 || product.isActive === false ? x.disabledButton : ""}`}
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
                </div>
            )}

            {/* Carrito */}
            <div>
                {/* <h3>Carrito</h3> */}
                <div className={x.tableContainer}>
                    <table className={x.table}>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.products.length > 0 ? (
                                cart.products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{String(product.code).slice(-4)}</td>
                                        <td>{product.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.5" // Permite valores con decimales
                                                min="0"     // Restringe valores negativos
                                                value={product.quantity}
                                                onChange={(e) => {
                                                    const value = parseFloat(e.target.value); // Convierte el valor a decimal
                                                    updateProductQuantity(product.id, Number.isNaN(value) ? 0 : value); // Valida si es un número
                                                }}
                                            />

                                        </td>
                                        <td>${product.price.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}</td>
                                        <td>${(product.quantity * product.price).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}</td>
                                        <td>
                                            <button
                                                className={x.deleteButton}
                                                onClick={() => removeProductFromCart(product.id)}
                                            >
                                                <FaRegTrashAlt size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className={x.emptyCartMessage}>
                                        Carrito vacío
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Métodos de pago */}
            <div className={x.paymentMethods}>
                <div className={x.chekboxDivHome}>
                    <label>
                        <input
                            type="radio"
                            value="cash"
                            checked={paymentMethod === "cash"}
                            onChange={() => handlePaymentMethodChange("cash")}
                            className={x.checkStile}
                        />
                        Efectivo
                    </label>

                    <label>
                        <input
                            type="radio"
                            value="electronic"
                            checked={paymentMethod === "electronic"}
                            onChange={() => handlePaymentMethodChange("electronic")}
                            className={x.checkStile}
                        />
                        Pago Electrónico
                    </label>

                    {

                    }
                </div>
                {/* a quien le entro la plata */}


                {
                    !showInputs && (<div className={x.acountDiv}>
                        <label>
                            <input
                                type="radio"
                                value="dorca"
                                checked={account_1 === "dorca"}
                                onChange={() => handleUserMoney("dorca")}
                                className={x.checkStile}
                            />
                            Cuenta 1
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="jonny"
                                checked={account_1 === "jonny"}
                                onChange={() => handleUserMoney("jonny")}
                                className={x.checkStile}
                            />
                            Cuenta 2
                        </label>
                    </div>)
                }

                {/* a quien le entro la plata */}

                {showInputs && (
                    <div className={x.discount}>
                        {/* <label>Descuento (%):</label> */}
                        {
                            data.total_without_discount > Number(30000)
                                ?
                                <label>
                                    Descuento (%):
                                    <input
                                        type="number"
                                        step="0.01" // Permite valores con decimales
                                        min="0"     // Opcional, establece un mínimo de 0
                                        value={discount}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            setDiscount(Number.isNaN(value) ? 0 : value); // Verifica si es un número válido
                                        }}
                                    />

                                </label>
                                : ''
                        }

                        <label>Pago con ($):

                            <input
                                type="number"
                                value={pay}
                                onChange={(e) => setPay(parseFloat(e.target.value) || 0)}
                            />
                        </label>
                    </div>
                )}
                <div className={x.divRight}>
                    <span className={x.finalMount1}>
                        Monto Total: $
                        {calculateSubTotal().toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                    <span className={x.finalMount}>
                        Monto Final: $
                        {calculateTotalWithDiscount().toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                    <span className={x.moneyBack}>Vuelto: ${calculateTurned().toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}</span>
                </div>
            </div>

            {
                cart.products.length
                    ? <div className={x.total}>
                        <button className={x.completeButton} onClick={sendOrder}>
                            Finalizar Compra
                        </button>
                        <button className={x.cleanCart} onClick={clearCart}>
                            Vaciar Carrito
                        </button>

                        {
                            cart.products.length <= 16
                                ? <button className={x.completeButton} onClick={createPDF}>
                                    PDF
                                </button>
                                : <span>PDF exedido: {cart.products.length - 16}</span>
                        }

                    </div>
                    : ''
            }
        </div>
    );

};

export default Home;