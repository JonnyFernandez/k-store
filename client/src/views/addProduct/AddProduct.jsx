import styleC from './AddProduct.module.css'

import { Nav } from '../../components';

const AddProduct = () => {

    return (
        <div className={styleC.addProd}>
            <Nav />
            <div className={styleC.addProdContainer}>
                <h1>Agregar prod</h1>
            </div>
        </div>
    )
}

export default AddProduct