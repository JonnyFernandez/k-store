import { useEffect } from 'react';
import Swal from 'sweetalert2'; // Para mostrar errores
import styleRepont from './StockReport.module.css'; // Asegúrate de tener estilos personalizados en este archivo
import { useProd } from '../../context/ProdContext';
import { FaArrowUp } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StockReport = () => {
    const { getStockReport, stockReport } = useProd()
    const { user } = useAuth();
    const navigate = useNavigate();


    const fetchData = async () => {
        try {
            await getStockReport();

        } catch (error) {
            console.error('Error fetching stock report:', error.response.data.message);
            const res = error.response.data.message
            localStorage.removeItem('user');

            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: res,
                footer: 'Soporte técnico: "arcancode@gmail.com"',
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
        } else {
            fetchData();
        }


    }, [user?.type]);

    // Mostrar un mensaje de carga mientras se obtienen los datos
    if (!stockReport) {
        return <div className={styleRepont.loading}>Cargando datos del stock...</div>;
    }

    // console.log(stockReport);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(value);
    };


    return (

        <div className={styleRepont.container}>
            <h1 className={styleRepont.title}>Reporte de Stock</h1>
            {/* <h1>Trabajando el reporte de stock</h1> */}
            <div className={styleRepont.summary}>
                {/* <h2>Resumen General</h2> */}
                <ul>
                    <li>
                        <strong>Stock total:</strong> {stockReport.totalStock}
                    </li>
                    <li>
                        <strong>Valor total stock:</strong> {formatCurrency(stockReport.totalCostValue)}
                    </li>
                    <li>
                        <strong>Valor total de venta:</strong> {formatCurrency(stockReport.totalPriceValue)}
                    </li>
                    <li>
                        <strong>Ganancia general:</strong> {formatCurrency(stockReport.profitMargin)}
                    </li>
                </ul>
            </div>
            {/* Tabla de detalles por producto */}
            <div className={styleRepont.tableContainer}>
                <table className={styleRepont.table}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad en Stock</th>
                            <th>Costo Total (con IVA)</th>
                            <th>Precio Total</th>
                            <th>Ganancia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockReport.productDetails?.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.stock}</td>
                                <td>
                                    {isNaN(product.costValue)
                                        ? "N/A"
                                        : `${formatCurrency(product.costValue)}`}
                                </td>
                                <td>
                                    {isNaN(product.priceValue)
                                        ? "N/A"
                                        : `${formatCurrency(product.priceValue)}`}
                                </td>
                                <td style={{
                                    color: parseFloat(product.profitValue) > 0 ? "green" : "red",
                                    fontWeight: "bold",
                                }}>
                                    {isNaN(product.profitValue)
                                        ? "N/A"
                                        : `${formatCurrency(product.profitValue)}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>







            {/* Resumen de Totales */}

            <a href="#nav" className={styleRepont.btnFloating}>
                <FaArrowUp size={24} />
            </a>
        </div>
    );
};

export default StockReport;
