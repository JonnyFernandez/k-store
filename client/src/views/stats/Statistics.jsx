import { useEffect, useState } from "react";
import { getStatistics } from "../../api/product";
import { Nav } from "../../components";
import styleStat from "./Statistics.module.css";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { CalendarDays, TrendingUp, Package } from "lucide-react";
import moment from 'moment';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Statistics = () => {
    const [date1, setDate1] = useState("");
    const [date2, setDate2] = useState("");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);




    // 🕒 Formatear fecha actual
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setDate1(today);
        setDate2(today);
    }, []);

    // 📊 Cargar estadísticas
    const fetchStats = async (d1, d2) => {
        try {
            setLoading(true);
            const { data } = await getStatistics(d1, d2);
            setStats(data);
        } catch (err) {
            console.error("Error al obtener estadísticas:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔁 Cargar al montar
    useEffect(() => {
        if (date1 && date2) fetchStats(date1, date2);
    }, [date1, date2]);

    return (
        <div>
            <Nav />
            <div className={styleStat.statContainer}>
                <h1 className={styleStat.title}>📈 Estadísticas de Ventas</h1>

                {/* 📅 Filtros de fecha */}
                <div className={styleStat.dateFilters}>
                    <div className={styleStat.dateInput}>
                        <label>Desde:</label>
                        <input
                            type="date"
                            value={date1}
                            onChange={(e) => setDate1(e.target.value)}
                        />
                    </div>

                    <div className={styleStat.dateInput}>
                        <label>Hasta:</label>
                        <input
                            type="date"
                            value={date2}
                            onChange={(e) => setDate2(e.target.value)}
                        />
                    </div>

                    <button
                        className={styleStat.searchBtn}
                        onClick={() => fetchStats(date1, date2)}
                    >
                        Buscar
                    </button>
                </div>

                {/* 🕓 Estado de carga */}
                {loading ? (
                    <p className={styleStat.loading}>Cargando estadísticas...</p>
                ) : !stats ? (
                    <p className={styleStat.error}>No se pudieron cargar las estadísticas.</p>
                ) : (
                    <>
                        {/* <h3 className={styleStat.period}>{stats.period}</h3> */}

                        {/* 🔸 Tarjetas resumen */}
                        <div className={styleStat.summaryCards}>
                            <div className={styleStat.card}>
                                <TrendingUp className={styleStat.icon} />
                                <div>
                                    <h4>Productos Más Vendidos</h4>
                                    <p>{stats.mostSoldProducts?.length || 0}</p>
                                </div>
                            </div>

                            <div className={styleStat.card}>
                                <Package className={styleStat.icon} />
                                <div>
                                    <h4>Total de Unidades Vendidas</h4>
                                    <p>
                                        {stats.mostSoldProducts
                                            ?.reduce((acc, p) => acc + p.totalQuantity, 0)
                                            .toLocaleString("es-AR")}
                                    </p>
                                </div>
                            </div>

                            <div className={styleStat.card}>
                                <CalendarDays className={styleStat.icon} />
                                <div>
                                    <h4>Rango de Fechas</h4>
                                    <p>
                                        {/* {moment(date1).format("DD/MM/YYYY")} */}
                                        {moment(date1).format("DD/MM/YYYY")} → {moment(date2).format("DD/MM/YYYY")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 📊 Gráfico de barras */}
                        <div className={styleStat.chartContainer}>
                            <h2>Productos más vendidos</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={stats.mostSoldProducts}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="totalQuantity" fill="#0088FE" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 🥧 Gráfico circular */}
                        <div className={styleStat.pieContainer}>
                            <h2>Distribución de Ventas</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats.mostSoldProducts}
                                        dataKey="totalQuantity"
                                        nameKey="name"
                                        outerRadius={120}
                                        fill="#8884d8"
                                        label
                                    >
                                        {stats.mostSoldProducts.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Statistics;
