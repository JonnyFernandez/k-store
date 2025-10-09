import styleC from './UpdateStock.module.css'

import { Nav } from '../../components';

const UpdateStock = () => {

    return (
        <div className=''>
            <Nav />
            <div className={styleC.updateContainer}>
                <h1>update stock</h1>
            </div>
        </div>
    )
}

export default UpdateStock