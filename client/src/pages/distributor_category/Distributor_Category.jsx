import { useState, useEffect } from "react";
import styleSet from "./Distributor_Category.module.css";
import Swal from "sweetalert2";
import { FaMapMarkerAlt, FaChevronLeft, FaArrowLeft, FaWhatsapp, FaEnvelope, FaArrowUp, FaRegTrashAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";



const Distributor_Category = ({ toggleOpen }) => {
    const [categories, setCategories] = useState([]);
    const [distributors, setDistributors] = useState([]);



    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDistributors, setSelectedDistributors] = useState([]);


    useEffect(() => {
        setCategories(JSON.parse(localStorage.getItem("categories")) || []);
        setDistributors(JSON.parse(localStorage.getItem("distributors")) || []);
    }, []);

    const handleSelect = (e, type) => {
        const value = e.target.value;
        if (!value) return;

        if (type === "category") {
            if (selectedCategories.includes(value)) {
                Swal.fire({
                    icon: "error",
                    title: "Categoria Incluida",
                });
            } else {
                const updatedCategories = [...selectedCategories, value];
                setSelectedCategories(updatedCategories);
                localStorage.setItem("category_select", JSON.stringify(updatedCategories));
            }
        } else if (type === "distributor") {
            if (selectedDistributors.includes(value)) {
                Swal.fire({
                    icon: "error",
                    title: "Distribuidor Incluido",
                });
            } else {
                const updatedDistributors = [...selectedDistributors, value];
                setSelectedDistributors(updatedDistributors);
                localStorage.setItem("distributors_select", JSON.stringify(updatedDistributors));
            }
        }
    };

    const handleDelete = (type, id) => {
        if (type === "category") {
            const updatedCategories = selectedCategories.filter((item) => item !== id);
            setSelectedCategories(updatedCategories);
            localStorage.setItem("category_select", JSON.stringify(updatedCategories));
        } else if (type === "distributor") {
            const updatedDistributors = selectedDistributors.filter((item) => item !== id);
            setSelectedDistributors(updatedDistributors);
            localStorage.setItem("distributorsSelect", JSON.stringify(updatedDistributors));
        }
    };

    const clearStore = () => {
        Swal.fire({
            icon: "success",
            title: "Eliminacion exitosa",
        });
        localStorage.removeItem('distributors_select')
        localStorage.removeItem('category_select')
        setSelectedCategories([])
        setSelectedDistributors([])

    }





    return (
        <div className={styleSet.containerDisCat}>

            <NavLink to={'/prod'} className={styleSet.closeModeal} >
                <FaArrowLeft size={20} />
            </NavLink>
            <button className={styleSet.clearStora} onClick={clearStore}>
                <FaRegTrashAlt size={20} />
            </button>


            <div className={styleSet.div1}>
                {/* <h1>Categoría</h1> */}
                <label htmlFor="category" className={styleSet.label}>
                    Categoría:
                    <select className={styleSet.selectDistributor} onChange={(e) => handleSelect(e, "category")}>
                        <option value="">Seleccionar Categoria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>

                <div className={styleSet.div2Inside}>
                    {selectedCategories.map((catId) => {
                        const category = categories.find((c) => c.id == catId);
                        return (
                            <div key={catId}>
                                {category?.name} <div onClick={() => handleDelete("category", catId)}>X</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styleSet.div2}>
                {/* <h1>Distribuidor</h1> */}
                <label htmlFor="distributor" className={styleSet.label}>
                    Distribuidor:
                    <select className={styleSet.selectDistributor} onChange={(e) => handleSelect(e, "distributor")}>
                        <option value="">Seleccionar Distribuidor</option>
                        {distributors.map((distributor) => (
                            <option key={distributor.id} value={distributor.id}>{distributor.name}</option>
                        ))}
                    </select>
                </label>

                <div className={styleSet.div2Inside}>
                    {selectedDistributors.map((distId) => {
                        const distributor = distributors.find((d) => d.id == distId);
                        return (
                            <div key={distId}>
                                {distributor?.name} <div onClick={() => handleDelete("distributor", distId)}>X</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Distributor_Category;
