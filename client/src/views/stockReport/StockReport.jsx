import styleS from './StockReport.module.css'

import { Nav } from '../../components';

const StockReport = () => {

    return (
        <div className=''>
            <Nav />
            <div className={styleS.stockContainer}>
                <h1>reporte de Stock</h1>
            </div>
        </div>
    )
}

export default StockReport