import { useEffect, useState } from 'react';
import { getReportStock } from '../../api/product';
import { Nav } from '../../components';
import styleS from './StockReport.module.css';
import { Package, TrendingUp, DollarSign } from 'lucide-react';

const StockReport = () => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await getReportStock();
                setReport(data);
            } catch (err) {
                console.error('Error cargando reporte de stock:', err);
            }
        };
        fetchReport();
    }, []);

    if (!report) return <p className={styleS.loading}>Cargando reporte...</p>;

    return (
        <div>
            <Nav />
            <div className={styleS.stockContainer}>
                <h1 className={styleS.title}>{report.report_name}</h1>

                {/* 📊 Tarjetas Resumen */}
                <div className={styleS.summaryCards}>
                    <div className={styleS.card}>
                        <DollarSign className={styleS.icon} />
                        <div>
                            <h3>Valor Total de Stock</h3>
                            <p>${parseFloat(report.total_stock_value).toLocaleString('es-AR')}</p>
                        </div>
                    </div>

                    <div className={styleS.card}>
                        <TrendingUp className={styleS.icon} />
                        <div>
                            <h3>Valor Total de Venta</h3>
                            <p>${parseFloat(report.total_sale_price).toLocaleString('es-AR')}</p>
                        </div>
                    </div>

                    <div className={styleS.card}>
                        <Package className={styleS.icon} />
                        <div>
                            <h3>Margen Total de Ganancia</h3>
                            <p>${parseFloat(report.total_profit_margin).toLocaleString('es-AR')}</p>
                        </div>
                    </div>
                </div>

                {/* 🧾 Tabla de productos */}
                <table className={styleS.table}>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Stock</th>
                            <th>Costo</th>
                            <th>Precio Venta</th>
                            <th>Ganancia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report?.products.map((p) => (
                            <tr
                                key={p.id}
                                className={
                                    p.stock === 0
                                        ? styleS.outOfStock
                                        : p.stock < 5
                                            ? styleS.lowStock
                                            : styleS.inStock
                                }
                            >
                                <td>{p.code}</td>
                                <td>{p.name}</td>
                                <td>{p.stock}</td>
                                <td>${p.cost.toLocaleString('es-AR')}</td>
                                <td>${p.price.toLocaleString('es-AR')}</td>
                                <td>${p.profit_amount.toLocaleString('es-AR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockReport;
