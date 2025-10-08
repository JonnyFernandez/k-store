import { Link } from "react-router-dom";
import { X, LayoutDashboard, PlusCircle, BarChart2 } from "lucide-react";
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
                    <h2>Menú</h2>
                    <button onClick={onClose} className={styleSide.closeBtn}>
                        <X size={22} />
                    </button>
                </div>

                <nav className={styleSide.nav}>
                    <Link to="/catalogo" className={styleSide.link}>
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
                </nav>

                <footer className={styleSide.footer}>
                    © 2025 Distribuidora Marelis
                </footer>
            </aside>
        </>
    );
};

export default SideBar;
