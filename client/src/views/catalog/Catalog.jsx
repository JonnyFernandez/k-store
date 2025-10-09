import styleC from './Catalog.module.css'

import { Nav } from '../../components';

const Catalog = () => {

    return (
        <div className={styleC.catalog}>
            <Nav />
            <div className={styleC.catalogCont}>
                <h1>Catalogo</h1>
            </div>
        </div>
    )
}

export default Catalog