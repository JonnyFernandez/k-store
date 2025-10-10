import styleC from './Catalog.module.css'

import { Nav, Card } from '../../components';

const Catalog = () => {
    const image1 = "https://http2.mlstatic.com/D_NQ_NP_2X_991730-MLA91339480713_082025-F.webp"

    const data = {
        id: 1,
        name: "Cloro granulado",
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_968989-MLA81902562372_012025-F.webp",
        stock: 9,
        minStock: 10,
        price: 1100,
        code: "x123",
        discountPrice: 900,
        discount: 0,
        isActive: true,
        isFeatured: true

    }

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
                    <div className={styleC.cardDiv}>
                        <Card id={data.id} name={data.name} image={data.image} stock={data.stock} minStock={data.minStock} price={data.price} code={data.code} discountPrice={data.discountPrice} discount={data.discount} isActive={data.isActive} isFeatured={data.isFeatured} />
                    </div>
                    <div className={styleC.cardDiv}>
                        <Card id={data.id} name={data.name} image={data.image} stock={data.stock} minStock={data.minStock} price={data.price} code={data.code} discountPrice={data.discountPrice} discount={data.discount} isActive={data.isActive} isFeatured={data.isFeatured} />
                    </div>
                    <div className={styleC.cardDiv}>
                        <Card id={data.id} name={data.name} image={data.image} stock={data.stock} minStock={data.minStock} price={data.price} code={data.code} discountPrice={data.discountPrice} discount={data.discount} isActive={data.isActive} isFeatured={data.isFeatured} />
                    </div>
                    <div className={styleC.cardDiv}>
                        <Card id={data.id} name={data.name} image={data.image} stock={data.stock} minStock={data.minStock} price={data.price} code={data.code} discountPrice={data.discountPrice} discount={data.discount} isActive={data.isActive} isFeatured={data.isFeatured} />
                    </div>
                    <div className={styleC.cardDiv}>
                        <Card id={data.id} name={data.name} image={data.image} stock={data.stock} minStock={data.minStock} price={data.price} code={data.code} discountPrice={data.discountPrice} discount={data.discount} isActive={data.isActive} isFeatured={data.isFeatured} />
                    </div>
                    <div className={styleC.cardDiv}>
                        <Card id={data.id} name={data.name} image={data.image} stock={data.stock} minStock={data.minStock} price={data.price} code={data.code} discountPrice={data.discountPrice} discount={data.discount} isActive={data.isActive} isFeatured={data.isFeatured} />
                    </div>
                    <div className={styleC.cardDiv}>
                        <Card id={data.id} name={data.name} image={data.image} stock={data.stock} minStock={data.minStock} price={data.price} code={data.code} discountPrice={data.discountPrice} discount={data.discount} isActive={data.isActive} isFeatured={data.isFeatured} />
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Catalog