import {
    useEffect,
    useState
} from "react";


import {

    getProfile,
    updateProfile,
    deleteAccount,

    getResidents,
    transferManager,

    getManagerPaymentInfo,
    updateManagerPaymentInfo

} from "../../api/userApi";



export default function ManagerProfile() {


    const [profile, setProfile] =
        useState(null);



    const [form, setForm] =
        useState({

            fullName: "",
            email: "",
            floorNumber: "",
            unitNumber: ""

        });



    const [card, setCard] =
        useState({

            paymentCardNumber: "",
            paymentCardHolder: ""

        });



    const [residents, setResidents] =
        useState([]);



    const [selectedManager, setSelectedManager] =
        useState("");



    const [loading, setLoading] =
        useState(true);



    const [saving, setSaving] =
        useState(false);






    const fetchProfile = async () => {


        try {


            const data =
                await getProfile();



            setProfile(data);



            setForm({

                fullName:
                    data.fullName || "",


                email:
                    data.email || "",


                floorNumber:
                    data.floorNumber || "",


                unitNumber:
                    data.unitNumber || ""

            });





            if (
                data.role === "PURCHASE_MANAGER"
            ) {


                const cardInfo =
                    await getManagerPaymentInfo();


                setCard(cardInfo);



                const residentsList =
                    await getResidents();


                setResidents(
                    residentsList
                );


            }



        }
        catch (error) {


            console.log(error);


            alert(
                "خطا در دریافت اطلاعات پروفایل"
            );


        }
        finally {


            setLoading(false);


        }


    };







    useEffect(() => {


        fetchProfile();


    }, []);









    const handleChange = (e) => {


        setForm({

            ...form,

            [e.target.name]:
                e.target.value

        });


    };









    const handleUpdate = async (e) => {


        e.preventDefault();



        try {


            setSaving(true);



            const result =
                await updateProfile(form);



            setProfile(result);



            alert(
                "اطلاعات ذخیره شد"
            );


        }
        catch (error) {


            console.log(error);


            alert(
                "خطا در ذخیره اطلاعات"
            );


        }
        finally {


            setSaving(false);


        }


    };









    const handleCardChange = (e) => {


        setCard({

            ...card,

            [e.target.name]:
                e.target.value

        });


    };









    const handleCardUpdate = async () => {


        try {


            await updateManagerPaymentInfo(
                card
            );


            alert(
                "اطلاعات کارت ذخیره شد"
            );


        }
        catch (error) {


            console.log(error);


            alert(
                "خطا در ذخیره اطلاعات کارت"
            );


        }


    };









    const handleTransfer = async () => {


        if (!selectedManager) {


            alert(
                "یک ساکن را انتخاب کنید"
            );


            return;


        }




        const confirm =
            window.confirm(
                "آیا مسئول خرید منتقل شود؟"
            );



        if (!confirm)
            return;




        try {


            await transferManager(
                Number(selectedManager)
            );



            alert(
                "مسئول خرید منتقل شد"
            );



            window.location.reload();



        }
        catch (error) {


            console.log(error);



            alert(

                error.response?.data?.message ||
                "خطا در انتقال مسئول خرید"

            );


        }


    };









    const handleDeleteAccount = async () => {


        const confirm =
            window.confirm(
                "آیا مطمئن هستید؟"
            );



        if (!confirm)
            return;




        try {


            const result =
                await deleteAccount();



            alert(
                result.message
            );



            localStorage.removeItem(
                "token"
            );



            window.location.href = "/login";


        }
        catch (error) {


            console.log(error);


            alert(

                error.response?.data?.message ||
                "خطا در حذف حساب"

            );


        }


    };









    if (loading) {


        return (

            <h2>
                در حال دریافت اطلاعات...
            </h2>

        );


    }








    return (

        <div className="manager-profile-page">


            <h1>
                پروفایل مسئول خرید
            </h1>






            <form
                onSubmit={handleUpdate}
            >



                <label>
                    نام و نام خانوادگی
                </label>


                <input

                    name="fullName"

                    value={
                        form.fullName
                    }

                    onChange={
                        handleChange
                    }

                />






                <label>
                    شماره موبایل
                </label>


                <input

                    value={
                        profile.mobile
                    }

                    disabled

                />







                <label>
                    ایمیل
                </label>


                <input

                    name="email"

                    value={
                        form.email
                    }

                    onChange={
                        handleChange
                    }

                />







                <label>
                    طبقه
                </label>


                <input

                    name="floorNumber"

                    value={
                        form.floorNumber
                    }

                    onChange={
                        handleChange
                    }

                />







                <label>
                    واحد
                </label>


                <input

                    name="unitNumber"

                    value={
                        form.unitNumber
                    }

                    onChange={
                        handleChange
                    }

                />





                <button
                    disabled={saving}
                >

                    {
                        saving
                            ?
                            "در حال ذخیره..."
                            :
                            "ذخیره تغییرات"
                    }


                </button>



            </form>









            <hr />








            <div>


                <h3>
                    اطلاعات کارت مسئول خرید
                </h3>




                <input

                    name="paymentCardNumber"

                    placeholder="شماره کارت"

                    value={
                        card.paymentCardNumber || ""
                    }

                    onChange={
                        handleCardChange
                    }

                />




                <input

                    name="paymentCardHolder"

                    placeholder="نام صاحب کارت"

                    value={
                        card.paymentCardHolder || ""
                    }

                    onChange={
                        handleCardChange
                    }

                />





                <button

                    type="button"

                    onClick={
                        handleCardUpdate
                    }

                >

                    ذخیره کارت

                </button>


            </div>









            <hr />









            <div>


                <h3>
                    تغییر مسئول خرید
                </h3>




                <select

                    value={
                        selectedManager
                    }

                    onChange={
                        e =>
                            setSelectedManager(
                                e.target.value
                            )
                    }

                >


                    <option value="">
                        انتخاب ساکن
                    </option>




                    {
                        residents.map(
                            resident => (


                                <option

                                    key={
                                        resident.userId
                                    }

                                    value={
                                        resident.userId
                                    }

                                >


                                    {
                                        resident.fullName
                                    }

                                    {" - واحد "}

                                    {
                                        resident.unitNumber
                                    }


                                </option>


                            )
                        )
                    }


                </select>





                <button

                    type="button"

                    onClick={
                        handleTransfer
                    }

                >

                    انتقال مسئول خرید

                </button>



            </div>









            <div className="danger-zone">


                <h3>
                    حذف حساب کاربری
                </h3>


                <button

                    type="button"

                    onClick={
                        handleDeleteAccount
                    }

                >

                    حذف حساب

                </button>



            </div>





        </div>


    );


}