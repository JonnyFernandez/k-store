import React, { useState, useEffect } from 'react';
import f from './Distributor.module.css';

import { Modal } from '../../components'
import { useProd } from '../../context/ProdContext';
import { Update_Distributor_Masive } from '../../components';


const Distributor = () => {
    const { add_distributor, get_distributor, add_distributor_number, toggle_distributor_status, delete_distributor, distributors } = useProd()

    const [inputs, setInputs] = useState({
        name: "",
        address: "",
        phoneNumbers: [],

    });
    // console.log(inputs.phoneNumbers.at(-1));

    const [phoneNumber, setPhoneNumber] = useState("");



    const [editingDistributorId, setEditingDistributorId] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    // Cargar distribuidores al montar el componente
    useEffect(() => {
        fetchDistributors();
    }, []);

    const fetchDistributors = async () => await get_distributor();;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs({
            ...inputs,
            [name]: value.toUpperCase(),
        });
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const addPhoneNumber = () => {
        if (phoneNumber.trim() !== "") {
            setInputs((prev) => ({
                ...prev,
                phoneNumbers: [...prev.phoneNumbers, phoneNumber.trim()],
            }));
            setPhoneNumber("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputs.name || !inputs.address || inputs.phoneNumbers.length === 0) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (editingDistributorId) {
            // Actualizar distribuidor
            let num = { newPhoneNumber: inputs.phoneNumbers.at(-1) }
            await add_distributor_number(editingDistributorId, num);
            alert("Distribuidor actualizado correctamente.");
            setEditingDistributorId(null);
        } else {
            // Crear nuevo distribuidor
            await add_distributor(inputs);
            alert("Distribuidor creado correctamente.");
        }

        fetchDistributors();
        setInputs({ name: "", address: "", phoneNumbers: [] });
    };

    const handleEdit = (distributor) => {
        setEditingDistributorId(distributor.id);
        setInputs({
            name: distributor.name,
            address: distributor.address,
            phoneNumbers: distributor.phoneNumbers,
        });
    };

    const handleDelete = async (id) => {
        await delete_distributor(id);
        alert("Distribuidor eliminado correctamente.");
        fetchDistributors();
    };

    const toggleStatus = async (id) => {
        await toggle_distributor_status(id);
        alert('Actualizacion de estado')
        fetchDistributors();
    };



    return (
        <div className={f.distributor}>
            <h2>{editingDistributorId ? "Editar Distribuidor" : "Ingresar Distribuidor"}</h2>
            <button onClick={toggleOpen}>Masivo Costo</button>
            <div className={f.distributorContainer}>
                <form
                    className={`${f.inputsContainerDistributor} ${f.responsiveForm}`}
                    onSubmit={handleSubmit}
                >
                    <div className={f.row}>
                        <div className={f.columnDistributor}>
                            <label htmlFor="name" className={f.label}>
                                Nombre del Distribuidor
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nombre del distribuidor"
                                value={inputs.name}
                                onChange={handleChange}
                            />

                            <label htmlFor="address" className={f.label}>
                                Dirección
                            </label>
                            <textarea
                                name="address"
                                id="address"
                                placeholder="Dirección"
                                rows="2"
                                value={inputs.address}
                                onChange={handleChange}
                            ></textarea>

                            <label htmlFor="phoneNumber" className={f.label}>
                                Número de Teléfono
                            </label>
                            <div className={f.phoneInputContainer}>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    placeholder="Agregar número de teléfono"
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                />
                                <button type="button" onClick={addPhoneNumber}>
                                    Agregar
                                </button>
                            </div>

                            <ul className={f.phoneNumbersList}>
                                {inputs.phoneNumbers.map((number, index) => (
                                    <li key={index} className={f.phoneNumberItem}>
                                        {number}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <button type="submit">
                        {editingDistributorId ? "Actualizar Distribuidor" : "Guardar Distribuidor"}
                    </button>
                </form>
            </div>

            <h2>Lista de Distribuidores</h2>
            <div className={f.distributorsList}>
                {distributors
                    .slice() // Crear una copia del array para no mutar el original
                    .sort((a, b) => b.isActive - a.isActive) // Ordenar por estado activo (activo primero)
                    .map((distributor) => (
                        <div
                            key={distributor.id}
                            className={`${f.distributorItem} ${!distributor.isActive ? f.paused : ""}`}
                        >
                            <h3>{distributor.name}</h3>
                            <p>Dirección: {distributor.address}</p>
                            <p>Teléfono/s: <b>{distributor.phoneNumbers.join(", ")}</b> </p>
                            <p>Estado: {distributor.isActive ? "Activo" : "Inactivo"}</p>
                            <button onClick={() => handleEdit(distributor)}>Editar</button>
                            <button onClick={() => handleDelete(distributor.id)}>Eliminar</button>
                            <button onClick={() => toggleStatus(distributor.id)}>
                                {distributor.isActive ? "Pausar" : "Activar"}
                            </button>
                        </div>
                    ))}
            </div>
            <Modal isOpen={isOpen} toggleOpen={toggleOpen}>
                <Update_Distributor_Masive toggleOpen={toggleOpen} />
            </Modal>

        </div>
    );
};

export default Distributor;
