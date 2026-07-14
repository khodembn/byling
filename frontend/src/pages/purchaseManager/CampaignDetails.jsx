import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import {
  getCampaign,
  updateCampaign,
  deleteCampaign,
} from "../../api/campaignApi";

import {
  getCampaignProducts,
  addCampaignProduct,
  updateCampaignProduct,
  deleteCampaignProduct,
} from "../../api/campaignProductApi";
import "../../styles/CampaignDetails.css";

import ProductTable from "../../components/campaign/ProductTable";
import ProductPickerModal from "../../components/modals/ProductPickerModal";
import ProductFormModal from "../../components/modals/ProductFormModal";
import RequestPaymentModal from "../../components/modals/RequestPaymentModal";


export default function CampaignDetails() {


  const { id } = useParams();

  const navigate = useNavigate();


  const [campaign, setCampaign] =
    useState(null);

  const [products, setProducts] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [pickerOpen, setPickerOpen] =
    useState(false);


  const [formOpen, setFormOpen] =
    useState(false);


  const [paymentModalOpen, setPaymentModalOpen] =
    useState(false);


  const [selectedProduct, setSelectedProduct] =
    useState(null);



  const canEdit =
    campaign &&
    ["DRAFT", "ACTIVE"]
      .includes(campaign.status);





  const fetchCampaign = async () => {

    try {

      const data =
        await getCampaign(id);

      setCampaign(data);


    } catch (error) {

      toast.error(
        "خطا در دریافت کمپین"
      );

    }

  };





  const fetchProducts = async () => {

    try {

      const data =
        await getCampaignProducts(id);

      setProducts(data);


    } catch (error) {

      toast.error(
        "خطا در دریافت محصولات"
      );

    }

  };





  useEffect(() => {

    const load = async () => {

      await fetchCampaign();

      await fetchProducts();

      setLoading(false);

    };


    load();

  }, [id]);







  const handleAddProduct = async (data) => {

    try {


      await addCampaignProduct(
        id,
        data
      );


      toast.success(
        "محصول اضافه شد"
      );


      setFormOpen(false);

      setSelectedProduct(null);


      fetchProducts();



    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "خطا در افزودن محصول"
      );

    }

  };









  const handleUpdateProduct = async (data) => {


    try {


      await updateCampaignProduct(
        id,
        selectedProduct.campaignProductId,
        data
      );


      toast.success(
        "محصول ویرایش شد"
      );


      setFormOpen(false);

      setSelectedProduct(null);


      fetchProducts();



    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "خطا در ویرایش محصول"
      );

    }


  };








  const handleDeleteProduct = async (campaignProductId) => {


    if (!window.confirm("محصول حذف شود؟"))
      return;



    try {


      await deleteCampaignProduct(
        id,
        campaignProductId
      );


      toast.success(
        "محصول حذف شد"
      );


      fetchProducts();



    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "خطا در حذف محصول"
      );

    }


  };









  const handleDeleteCampaign = async () => {


    if (!window.confirm("کمپین حذف شود؟"))
      return;


    try {


      await deleteCampaign(id);


      toast.success(
        "کمپین حذف شد"
      );


      navigate(
        "/purchase/campaigns"
      );


    } catch (error) {


      toast.error(
        error.response?.data?.message ||
        "خطا در حذف کمپین"
      );


    }


  };







  const handleEditCampaign = async () => {

    if (!campaign)
      return;


    const title =
      prompt(
        "عنوان کمپین",
        campaign.title || ""
      );



    const oldDate =
      campaign.paymentDeadline
        ?
        new Date(
          campaign.paymentDeadline
        )
          .toLocaleString("sv-SE")
          .slice(0, 16)
        :
        "";



    const paymentDeadline =
      prompt(
        "مهلت پرداخت",
        oldDate
      );



    if (
      !title &&
      !paymentDeadline
    )
      return;



    try {


      await updateCampaign(
        id,
        {
          title,
          paymentDeadline:
            paymentDeadline
              ?
              paymentDeadline.replace(" ", "T")
              :
              undefined
        }
      );



      toast.success(
        "کمپین ویرایش شد"
      );


      await fetchCampaign();



    } catch (error) {


      toast.error(
        error.response?.data?.message ||
        "خطا در ویرایش کمپین"
      );


    }

  };





  if (loading)

    return <h2>در حال بارگذاری...</h2>;








  return (

    <div className="campaign-details-page">


      <h1>
        مدیریت کمپین
      </h1>



      {
        campaign && (

          <div className="campaign-info-card">


            <h2>
              {campaign.title}
            </h2>



            <button
              className="back-btn"
              onClick={() =>
                navigate("/purchase/campaigns")
              }
            >
              بازگشت
            </button>



            {
              canEdit && (

                <>

                  <button
                    className="edit-btn"
                    onClick={handleEditCampaign}
                  >
                    ✏️ ویرایش
                  </button>


                  <button
                    className="delete-btn"
                    onClick={handleDeleteCampaign}
                  >
                    🗑 حذف
                  </button>

                </>

              )
            }



            <p>
              وضعیت:
              {" "}
              {campaign.status}
            </p>


            <p>
              ساختمان:
              {" "}
              {campaign.building?.buildingName}
            </p>


            <p>
              مدیر:
              {" "}
              {campaign.manager?.fullName}
            </p>


            {
              campaign.paymentDeadline && (

                <p>
                  مهلت پرداخت:
                  {" "}
                  {
                    new Date(
                      campaign.paymentDeadline
                    )
                      .toLocaleString("fa-IR")
                  }
                </p>

              )
            }



            {
              campaign.status === "ACTIVE" && (

                <button
                  className="payment-request-btn"
                  onClick={() =>
                    setPaymentModalOpen(true)
                  }
                >
                  💳 درخواست پرداخت
                </button>

              )

            }



          </div>

        )
      }






      <ProductTable

        products={products}

        campaignStatus={
          campaign?.status
        }

        onAddProduct={() =>
          setPickerOpen(true)
        }

        onEditProduct={(product) => {

          setSelectedProduct(product);

          setFormOpen(true);

        }}

        onDeleteProduct={handleDeleteProduct}

      />







      <ProductPickerModal

        open={pickerOpen}

        onClose={() =>
          setPickerOpen(false)
        }


        onSelect={(product) => {

          setSelectedProduct(product);

          setPickerOpen(false);

          setFormOpen(true);

        }}

        campaignProducts={products}

      />







      <ProductFormModal

        open={formOpen}

        product={selectedProduct}

        onClose={() => {

          setFormOpen(false);

          setSelectedProduct(null);

        }}

        onSubmit={
          selectedProduct?.campaignProductId
            ?
            handleUpdateProduct
            :
            handleAddProduct
        }

      />







      <RequestPaymentModal

        open={paymentModalOpen}

        campaignId={id}

        onClose={() =>
          setPaymentModalOpen(false)
        }

        onSuccess={() => {

          setPaymentModalOpen(false);

          fetchCampaign();

          fetchProducts();

        }}

      />



    </div>

  );


}