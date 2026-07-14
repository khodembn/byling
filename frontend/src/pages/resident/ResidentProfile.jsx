import {
    useEffect,
    useState
} from "react";


import {
    getProfile,
    updateProfile,
    deleteAccount
} from "../../api/userApi";



export default function ResidentProfile() {


    const [profile, setProfile] =
        useState(null);


    const [form, setForm] =
        useState({

            fullName: "",
            email: "",
            floorNumber: "",
            unitNumber: ""

        });



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



            setProfile(
                result.data
            );


            alert(
                "اطلاعات با موفقیت ذخیره شد"
            );



        }
        catch (error) {


            console.log(error);


            alert(
                "خطا در بروزرسانی اطلاعات"
            );


        }
        finally {

            setSaving(false);

        }


    };






    const handleDeleteAccount = async () => {


        const confirm =
            window.confirm(
                "آیا مطمئن هستید؟ حساب شما حذف خواهد شد."
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



            window.location.href =
                "/login";



        }
        catch (error) {


            console.log(error);


            alert(
                "خطا در حذف حساب کاربری"
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


        <div className="resident-profile-page">


            <h1>
                پروفایل من
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






                <hr />




                <h3>
                    اطلاعات ساختمان
                </h3>



                <p>
                    ساختمان:
                    {" "}
                    {profile.building.buildingName}
                </p>



                <p>
                    کد پستی:
                    {" "}
                    {profile.building.postalCode}
                </p>



                <p>
                    آدرس:
                    {" "}
                    {profile.building.address}
                </p>







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







            <div className="danger-zone">


                <h3>
                    حذف حساب کاربری
                </h3>



                <p>
                    با حذف حساب، اطلاعات کاربری شما حذف خواهد شد.
                </p>



                <button

                    type="button"

                    onClick={
                        handleDeleteAccount
                    }

                >

                    حذف حساب کاربری

                </button>


            </div>




        </div>


    );


}