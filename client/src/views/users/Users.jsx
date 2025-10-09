import styleU from './Users.module.css'

import { Nav } from '../../components';

const Users = () => {

    return (
        <div className=''>
            <Nav />
            <div className={styleU.usersContainer}>
                <h1>Gestion de usuarios</h1>
            </div>
        </div>
    )
}

export default Users