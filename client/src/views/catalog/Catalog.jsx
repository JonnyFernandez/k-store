import styleC from './Catalog.module.css'
import { Card, Nav } from '../../components';
import { useEffect, useState } from 'react';
import { getProducts } from '../../api/product';





const Catalog = () => {

    const [products, setProducts] = useState([])

    const fetchFunction = async () => {
        try {
            let aux = await getProducts()
            setProducts(aux.data)
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchFunction()
    }, [])
    // console.log(products);

    const showCards = () => {
        return (
            <>
                {products.map((item) => (
                    <div key={item.id} className={styleC.cardDiv}>
                        <Card
                            key={item.id}
                            id={item.id}
                            code={item.code}
                            name={item.name}
                            image={item.image}
                            stock={item.stock}
                            minStock={item.minStock}
                            price={item.price}
                            discountedPrice={item.discountedPrice}  // ✅ corregido
                            discount={item.discount}
                            isActive={item.isActive}
                            profit_amount={item.profit_amount}
                        />

                    </div>
                ))}
            </>
        );
    };



    return (
        <div className={styleC.catalog}>
            <Nav />
            <div className={styleC.catalogCont}>
                <div className={styleC.catalogHeader}>
                    <div>Categoria</div>
                    <div>Proveedro</div>
                    <div>Busqueda</div>
                    <div>low Stock</div>
                </div>


                <div className={styleC.cardContainer}>
                    {showCards()}
                </div>
            </div>
        </div>
    )
}

export default Catalog