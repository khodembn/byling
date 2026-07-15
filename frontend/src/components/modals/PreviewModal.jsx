import "../../styles/PreviewModal.css";

export default function PreviewModal({
    preview,
    campaignTitle,
    onClose
}) {


    if (!preview)
        return null;


    return (

        <div className="modal-overlay">


            <div className="modal-box">


                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ×
                </button>


                <h2>
                    پیش فاکتور
                    {" "}
                    {campaignTitle}
                </h2>



                {
                    preview.items.map(item => (

                        <div
                            key={item.campaignProductId}
                            className="invoice-item"
                        >


                            {
                                item.imageUrl ?

                                    <img
                                        src={
                                            `http://localhost:5000${item.imageUrl}`
                                        }
                                        width={80}
                                    />

                                    :

                                    <div>
                                        📦
                                    </div>

                            }



                            <h4>
                                {item.productName}
                            </h4>


                            <p>
                                تعداد:
                                {item.quantity}
                            </p>


                            <p>
                                قیمت واحد بازار:
                                {
                                    item.marketUnitPrice
                                        .toLocaleString()
                                }
                            </p>


                            <p>
                                قیمت واحد کمپین:
                                {
                                    item.bulkUnitPrice
                                        .toLocaleString()
                                }
                            </p>


                            <p>
                                قیمت بازار:
                                {
                                    item.marketTotal
                                        .toLocaleString()
                                }
                            </p>


                            <p>
                                قیمت کمپین:
                                {
                                    item.bulkTotal
                                        .toLocaleString()
                                }
                            </p>


                            <p>
                                هزینه ارسال:
                                {
                                    item.shipping
                                        .toLocaleString()
                                }
                            </p>


                            <p>
                                صرفه جویی:
                                {
                                    item.saving
                                        .toLocaleString()
                                }
                            </p>


                            <hr />


                        </div>

                    ))
                }




                <div className="invoice-summary">


                    <p>
                        جمع قیمت بازار:

                        {
                            preview.marketSubtotal
                                .toLocaleString()
                        }

                        تومان
                    </p>



                    <p>
                        جمع قیمت کمپین:

                        {
                            preview.bulkSubtotal
                                .toLocaleString()
                        }

                        تومان
                    </p>




                    <p>
                        هزینه ارسال:

                        {
                            preview.totalShipping
                                .toLocaleString()
                        }

                        تومان
                    </p>




                    <p>
                        صرفه جویی کل:

                        {
                            preview.totalSaving
                                .toLocaleString()
                        }

                        تومان
                    </p>




                    <p>
                        کمیسیون مدیر:

                        {
                            preview.managerCommission
                                .toLocaleString()
                        }

                        تومان
                    </p>




                    <p>
                        کمیسیون پلتفرم:

                        {
                            preview.platformCommission
                                .toLocaleString()
                        }

                        تومان
                    </p>




                    <h3>

                        مبلغ قابل پرداخت:

                        {
                            preview.payableAmount
                                .toLocaleString()
                        }

                        تومان

                    </h3>




                    <p>

                        تخفیف نهایی:

                        {
                            preview.finalDiscount
                                .toLocaleString()
                        }

                        تومان

                    </p>



                </div>


            </div>


        </div>

    );

}