import {
    useState
} from "react";


import {
    useParams,
    useNavigate
} from "react-router-dom";


import {
    uploadReceipt
} from "../../api/paymentApi";

import "../../styles/PaymentPage.css";

export default function PaymentPage() {


    const { orderId } = useParams();

    const navigate = useNavigate();



    const [receipt, setReceipt] = useState(null);

    const [transactionRef, setTransactionRef] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");




    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!receipt || !transactionRef) {

            alert("تصویر فیش و شناسه تراکنش الزامی است");

            return;

        }



        const formData = new FormData();


        formData.append(
            "receiptImage",
            receipt
        );


        formData.append(
            "transactionRef",
            transactionRef
        );



        try {


            setLoading(true);


            const result =
                await uploadReceipt(
                    orderId,
                    formData
                );



            setMessage(
                result.message
            );



            setTimeout(() => {

                navigate("/resident/orders");

            }, 2000);



        }
        catch (err) {

            console.log("PAYMENT ERROR:", err);

            console.log(
                "SERVER RESPONSE:",
                err.response?.data
            );

            alert(
                err.response?.data?.message ||
                "خطا در ثبت پرداخت"
            );

        }
        finally {

            setLoading(false);

        }



    };





    return (

        <div className="payment-page">


            <h1>
                پرداخت سفارش
            </h1>



            <form onSubmit={handleSubmit}>


                <label>
                    تصویر فیش واریزی
                </label>


                <input

                    type="file"

                    accept="image/*"

                    onChange={(e) => {
                        setReceipt(e.target.files[0])
                    }}

                />



                <label>

                    شناسه تراکنش

                </label>



                <input

                    value={transactionRef}

                    onChange={
                        e => setTransactionRef(e.target.value)
                    }

                    placeholder="مثلا 1111111112"

                />



                <button disabled={loading}>

                    {
                        loading
                            ?
                            "در حال ثبت..."
                            :
                            "ثبت پرداخت"

                    }

                </button>



            </form>



            {
                message &&

                <div>

                    {message}

                </div>

            }



        </div>

    )

}