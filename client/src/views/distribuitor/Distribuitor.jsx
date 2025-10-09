import styleD from './Distribuitor.module.css'

import { Nav } from '../../components';

const Distribuitor = () => {

    return (
        <div className=''>
            <Nav />
            <div className={styleD.providerContainer}>
                <h1>Distribuitor</h1>
            </div>
        </div>
    )
}

export default Distribuitor