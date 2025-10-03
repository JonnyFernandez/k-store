import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import m from './Statistics.module.css';
import Swal from 'sweetalert2';
import { useProd } from '../../context/ProdContext';
import { useAuth } from '../../context/AuthContext'
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar las dependencias de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
    const { getStatistic, statistics } = useProd()
    const { user } = useAuth();
    const navigate = useNavigate();

    // console.log(user);








    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    // const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showGrafic, setShowGrafic] = useState(true);




    // Función para obtener las estadísticas
    const fetchStatistics = async () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        setError(null);

        try {
            const formattedStartDate = moment(startDate).format("DD/MM/YYYY");
            const formattedEndDate = moment(endDate).format("DD/MM/YYYY");
            const info = await getStatistic(formattedStartDate, formattedEndDate);
            // setStatistics(info.data);


        } catch (error) {
            console.error('Error al obtener las estadísticas:', error);
            const message = error.response?.data?.message || 'No se pudieron obtener las estadísticas.';
            setError(message);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: message,
                footer: 'Soporte técnico: arcancode@gmail.com',
            });
            navigate('/');
        } finally {
            setLoading(false);
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
            fetchStatistics();
        }

    }, [user, startDate, endDate, user?.type])



    // Configuración del gráfico de barras
    const barChartData = {
        labels: statistics?.productSales ? Object.values(statistics.productSales).map(p => p.name) : [],
        datasets: [
            {
                label: 'Cantidad Vendida',
                data: statistics?.productSales ? Object.values(statistics.productSales).map(p => p.totalQuantity) : [],
                backgroundColor: '#0056b3',
                borderColor: '#A8A8B5',
                borderWidth: 4,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            title: { display: true, text: 'Productos Más Vendidos' },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `Cantidad: ${tooltipItem.raw}`,
                },
            },
        },
        scales: {
            x: { title: { display: true, text: 'Producto' } },
            y: { title: { display: true, text: 'Cantidad Vendida' }, beginAtZero: true },
        },
    };

    return (
        <div className={m.container}>
            <h2 className={m.titleStatistic}>Estadísticas de Ventas</h2>

            {/* Filtro de Fechas */}
            <div className={m.filters}>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={m.dateInput}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={m.dateInput}
                />
            </div>

            {/* Mensaje de Cargando o Error */}
            {loading && <p>Cargando estadísticas...</p>}
            {error && <p className={m.error}>{error}</p>}

            {/* Resumen de Estadísticas */}
            {statistics && (
                <div className={m.summary}>
                    <h3>Resumen del Período</h3>
                    <p><strong>Total de Ventas:</strong> ${statistics.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p><strong>Total de Órdenes:</strong> {statistics.totalOrders}</p>
                </div>
            )}

            {/* Botón para alternar entre gráfico y listado */}
            <button className={m.buttonToChange} onClick={() => setShowGrafic(prev => !prev)}>
                {showGrafic ? 'Ver Listado' : 'Ver Gráfica'}
            </button>

            {/* Mostrar gráfica o listado */}
            {statistics && statistics.productSales ? (
                showGrafic ? (
                    <div className={m.chartContainer}>
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>
                ) : (
                    <div className={m.productList}>
                        <h3>Productos Más Vendidos</h3>
                        <table className={m.productTable}>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad Vendida</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(statistics.productSales).map((product) => (
                                    <tr key={product.name}>
                                        <td>{product.name}</td>
                                        <td>{product.totalQuantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                !loading && <p>No hay datos suficientes para mostrar.</p>
            )}
        </div>
    );
};

export default Statistics;
