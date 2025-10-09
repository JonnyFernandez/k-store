import styleC from './SalesReport.module.css'

import { Nav } from '../../components';

const SalesReport = () => {

    return (
        <div className=''>
            <Nav />
            <div className={styleC.reportContainer}>
                <h1>Reporte de ventas</h1>
            </div>
        </div>
    )
}

export default SalesReport