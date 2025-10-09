import styleCateg from './Category.module.css'

import { Nav } from '../../components';

const Category = () => {

    return (
        <div className=''>
            <Nav />
            <div className={styleCateg.categoryContainer}>
                <h1>categorias</h1>
            </div>
        </div>
    )
}

export default Category