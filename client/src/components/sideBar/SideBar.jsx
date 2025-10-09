import { Link, NavLink } from "react-router-dom";
import {
    X,
    LayoutDashboard,
    PlusCircle,
    BarChart2,
    Package,
    TrendingUp,
    RefreshCcw,
    Users,
    Tags,
    Truck,
    LogOut,
} from "lucide-react";
import styleSide from "./SideBar.module.css";

const SideBar = ({ isOpen, onClose }) => {
    return (
        <>
            <div
                className={`${styleSide.overlay} ${isOpen ? styleSide.overlayShow : ""}`}
                onClick={onClose}
            ></div>

            <aside
                className={`${styleSide.sidebar} ${isOpen ? styleSide.open : ""}`}
            >
                <div className={styleSide.header}>
                    <NavLink className={styleSide.menu} to={'/home'}>
                        <h2>Menú</h2>
                    </NavLink>
                    <button onClick={onClose} className={styleSide.closeBtn}>
                        <X size={22} />
                    </button>
                </div>

                <nav className={styleSide.nav}>
                    <Link to="/catalog" className={styleSide.link}>
                        <LayoutDashboard size={20} />
                        <span>Catálogo</span>
                    </Link>

                    <Link to="/agregar-producto" className={styleSide.link}>
                        <PlusCircle size={20} />
                        <span>Agregar Producto</span>
                    </Link>

                    <Link to="/reporte-ventas" className={styleSide.link}>
                        <BarChart2 size={20} />
                        <span>Reporte de Ventas</span>
                    </Link>

                    <Link to="/reporte-stock" className={styleSide.link}>
                        <Package size={20} />
                        <span>Reporte de Stock</span>
                    </Link>

                    <Link to="/actualizar-stock" className={styleSide.link}>
                        <RefreshCcw size={20} />
                        <span>Actualizar Stock</span>
                    </Link>

                    <Link to="/estadisticas" className={styleSide.link}>
                        <TrendingUp size={20} />
                        <span>Estadísticas</span>
                    </Link>




                    <Link to="/category" className={styleSide.link}>
                        <Tags size={20} />
                        <span>Categoría</span>
                    </Link>

                    <Link to="/provider" className={styleSide.link}>
                        <Truck size={20} />
                        <span>Proveedores</span>
                    </Link>

                    <Link to="/usuario" className={styleSide.link}>
                        <Users size={20} />
                        <span>Gestión de Usuario</span>
                    </Link>

                    <Link to="#" className={styleSide.link}>
                        <LogOut size={20} />
                        <span>Salir</span>
                    </Link>
                </nav>

                <footer className={styleSide.footer}>
                    © 2025 Distribuidora Marelis
                </footer>
            </aside>
        </>
    );
};

export default SideBar;
