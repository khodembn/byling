

export default function ProductTable({

    products,

    onAddProduct

}) {

    return (

        <>

            <div className="product-header">

                <h2>

                    محصولات کمپین

                </h2>

                <button
                    onClick={onAddProduct}
                >

                    + افزودن محصول

                </button>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>محصول</th>

                        <th>قیمت فروشگاه</th>

                        <th>قیمت عمده</th>

                        <th>حد نصاب</th>

                        <th>سفارش فعلی</th>

                        <th>وضعیت</th>

                    </tr>

                </thead>

                <tbody>

                    {products.map(product => (

                        <tr
                            key={product.campaignProductId}
                        >

                            <td>

                                {product.productName}

                            </td>

                            <td>

                                {product.marketPrice}

                            </td>

                            <td>

                                {product.bulkPrice}

                            </td>

                            <td>

                                {product.thresholdQuantity}

                            </td>

                            <td>

                                {product.currentQuantity}

                            </td>

                            <td>

                                {product.status}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </>

    );

}