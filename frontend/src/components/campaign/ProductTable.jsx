
import "../../styles/ProductTable.css";

export default function ProductTable({

    products = [],

    campaignStatus,

    onAddProduct,

    onEditProduct,

    onDeleteProduct

}) {


    const canManage =
        ["DRAFT", "ACTIVE"].includes(campaignStatus);



    return (

        <>


            <div className="product-header">


                <h2>
                    محصولات کمپین
                </h2>



                {
                    canManage && (

                        <button
                            className="add-product-btn"
                            onClick={onAddProduct}
                        >
                            + افزودن محصول
                        </button>

                    )
                }


            </div>





            {
                products.length === 0 ? (

                    <div className="empty-products">

                        محصولی برای این کمپین ثبت نشده است

                    </div>


                ) : (


                    <table>


                        <thead>

                            <tr>

                                <th>محصول</th>

                                <th>قیمت فروشگاه</th>

                                <th>قیمت عمده</th>

                                <th>حد نصاب</th>

                                <th>سفارش فعلی</th>

                                <th>وضعیت</th>


                                {
                                    canManage && (

                                        <th>
                                            عملیات
                                        </th>

                                    )
                                }


                            </tr>


                        </thead>





                        <tbody>


                            {
                                products.map(product => (


                                    <tr
                                        key={
                                            product.campaignProductId
                                        }
                                    >


                                        <td>
                                            {product.productName}
                                        </td>



                                        <td>

                                            {
                                                Number(
                                                    product.marketPrice
                                                )
                                                    .toLocaleString("fa-IR")
                                            }

                                        </td>



                                        <td>

                                            {
                                                Number(
                                                    product.bulkPrice
                                                )
                                                    .toLocaleString("fa-IR")
                                            }

                                        </td>



                                        <td>
                                            {
                                                product.thresholdQuantity
                                            }
                                        </td>



                                        <td>
                                            {
                                                product.currentQuantity
                                            }
                                        </td>



                                        <td>
                                            {
                                                product.status
                                            }
                                        </td>





                                        {
                                            canManage && (

                                                <td className="product-actions">


                                                    <button

                                                        className="edit-product-btn"

                                                        onClick={() =>
                                                            onEditProduct(product)
                                                        }

                                                    >
                                                        ✏️ ویرایش
                                                    </button>





                                                    <button

                                                        className="delete-product-btn"

                                                        onClick={() =>
                                                            onDeleteProduct(
                                                                product.campaignProductId
                                                            )
                                                        }

                                                    >
                                                        🗑 حذف
                                                    </button>


                                                </td>

                                            )
                                        }




                                    </tr>


                                ))
                            }


                        </tbody>


                    </table>


                )

            }



        </>

    );

}