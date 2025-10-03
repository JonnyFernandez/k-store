import d from './Calculator.module.css';

import { useState } from 'react';

const Calculator = () => {
    const [data, setData] = useState({ costo: '', iva: '', iibb: '', otros: '', ganancia: '', off: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        const processedValue = parseFloat(value.replace(',', '.')) || '';
        setData((prevData) => ({ ...prevData, [name]: processedValue }));
    };

    const reset = () => setData({ costo: '', iva: '', iibb: '', otros: '', ganancia: '', off: '' });

    const costo = data.costo * (1 + ((data.iva / 100) + (data.iibb / 100)));
    const price = costo * (1 + ((data.otros + data.ganancia) / 100));
    const priceOff = price * (1 - (data.off / 100));
    const discount = price - priceOff;
    const margin = ((price - costo) / costo) * 100 || 0;

    return (
        <div className={d.home}>
            {/* <Nav /> */}
            <div className={d.container}>
                <h1 className={d.title}>Calculadora de Precios</h1>

                <div className={d.calculator}>
                    {/* Sección de Inputs */}
                    <div className={d.inputsContainer}>
                        {['costo', 'iva', 'iibb', 'otros', 'ganancia', 'off'].map((field, index) => (
                            <div key={index} className={d.inputGroup}>
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={data[field]}
                                    onChange={handleChange}
                                    placeholder=" "
                                    inputMode="decimal"
                                />
                                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)} ({field === 'costo' ? '$' : '%'})</label>
                            </div>
                        ))}
                    </div>

                    {/* Sección de Resultados */}
                    <div className={d.resultsContainer}>
                        {[
                            { label: 'Precio Final', value: `$${price.toFixed(2)}` },
                            { label: 'Precio con Descuento', value: `$${priceOff.toFixed(2)}` },
                            { label: 'Descuento', value: `$${discount.toFixed(2)}` },
                            { label: 'Descuento Aplicado', value: `${data.off || 0}%` },
                            { label: 'Margen de Ganancia', value: `${margin.toFixed(2)}%` },
                            { label: 'Ganancia Neta', value: `$${(priceOff - costo).toFixed(2)}` },
                        ].map((item, index) => (
                            <div key={index} className={d.resultItem}>
                                <span className={d.resultLabel}>{item.label}</span>
                                <span className={d.resultValue}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {(Object.values(data).some(value => value)) && (
                    <button className={d.resetButton} onClick={reset}>
                        Reiniciar
                    </button>
                )}
            </div>
        </div>
    );
};

export default Calculator;