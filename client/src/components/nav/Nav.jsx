import { useLocation } from "react-router-dom";
import styleNav from "./Nav.module.css";
import { Menu } from "lucide-react";
import { useState } from "react";
import SideBar from "../sideBar/SideBar";

const Nav = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Diccionario de rutas y sus títulos
    const routeTitles = {
        "/home": "Inicio",
        "/catalog": "Catálogo",
        "/agregar-producto": "Agregar Producto",
        "/reporte-ventas": "Reporte de Ventas",
        "/reporte-stock": "Reporte de Stock",
        "/estadisticas": "Estadísticas",
        "/actualizar-stock": "Actualizar Stock",
        "/usuario": "Gestión de Usuario",
        "/category": "Categorías",
        "/provider": "Proveedores",
    };

    // Buscar título según la ruta actual
    const currentTitle = routeTitles[location.pathname] || "";

    return (
        <nav className={styleNav.navContainer}>
            <div className={styleNav.box1}>
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
            </div>

            <div className={styleNav.box2}>
                {currentTitle && <h1 className={styleNav.title}>{currentTitle}</h1>}
            </div>

            <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />

            {/* <div className={styleNav.box1}>div3</div> */}
        </nav>
    );
};

export default Nav;
