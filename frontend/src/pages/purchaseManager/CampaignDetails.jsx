import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";


import {
  getCampaignProducts,
  addCampaignProduct,
  getCampaign,


} from "../../api/campaignApi";


import ProductTable from "../../components/campaign/ProductTable";
import ProductPickerModal from "../../components/modals/ProductPickerModal";
import ProductFormModal from "../../components/modals/ProductFormModal";
import RequestPaymentModal from "../../components/modals/RequestPaymentModal";


export default function CampaignDetails() {


  const { id } = useParams();

  const navigate = useNavigate();


  const [products, setProducts] = useState([]);

  const [campaign, setCampaign] = useState(null);


  const [loading, setLoading] = useState(true);



  const [pickerOpen, setPickerOpen] =
    useState(false);



  const [formOpen, setFormOpen] =
    useState(false);



  const [paymentModalOpen, setPaymentModalOpen] =
    useState(false);



  const [selectedProduct, setSelectedProduct] =
    useState(null);





  const fetchCampaign = async () => {

    try {

      const data =
        await getCampaign(id);

      setCampaign(data);

    }

    catch (err) {

      console.log(err);

    }

  };





  const fetchProducts = async () => {

    try {

      const data =
        await getCampaignProducts(id);


      setProducts(data);

    }

    catch (err) {

      console.error(err);

    }

    finally {

      setLoading(false);

    }

  };





  useEffect(() => {

    fetchCampaign();

    fetchProducts();

  }, [id]);







  const handleAddProduct = async (data) => {

    try {

      await addCampaignProduct(
        id,
        data
      );


      toast.success(
        "محصول با موفقیت اضافه شد"
      );


      setFormOpen(false);

      setSelectedProduct(null);


      fetchProducts();


    }

    catch (err) {


      toast.error(
        "خطا در افزودن محصول"
      );


      console.error(err);

    }

  };







  if (loading)

    return (

      <h2>
        در حال بارگذاری...
      </h2>

    );







  return (


    <div className="campaign-details-page">


      <h1>
        مدیریت کمپین
      </h1>





      {
        campaign && (


          <div className="campaign-info-card">



            <div>


              <h1>

                {campaign.title}

              </h1>




              <button

                className="back-btn"

                onClick={() =>
                  navigate("/purchase/campaigns")
                }

              >

                بازگشت

              </button>





              <span>

                {campaign.status}

              </span>



            </div>





            <p>

              ساختمان :

              {" "}

              {
                campaign.building.buildingName
              }

            </p>





            <p>

              مدیر :

              {" "}

              {
                campaign.manager.fullName
              }

            </p>





            <p>

              ایجاد :

              {" "}

              {
                new Date(
                  campaign.createdAt
                )
                  .toLocaleDateString("fa-IR")
              }

            </p>





            {
              campaign.paymentDeadline && (


                <p>

                  مهلت پرداخت :

                  {" "}

                  {
                    new Date(
                      campaign.paymentDeadline
                    )
                      .toLocaleString(
                        "fa-IR"
                      )
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

        onAddProduct={() =>
          setPickerOpen(true)
        }

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


        onSubmit={handleAddProduct}

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