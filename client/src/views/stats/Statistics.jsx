import styleStat from './Statistics.module.css'

import { Nav } from '../../components';

const Statistics = () => {

    return (
        <div className=''>
            <Nav />
            <div className={styleStat.statContainer}>
                <h1>Estadisticas</h1>
            </div>
        </div>
    )
}

export default Statistics