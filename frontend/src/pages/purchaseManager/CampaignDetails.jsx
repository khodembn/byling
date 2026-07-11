import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";

import {
  getCampaignProducts,
  addCampaignProduct,
} from "../../api/campaignApi";


import ProductTable from "../../components/campaign/ProductTable";
import ProductPickerModal from "../../components/modals/ProductPickerModal";
import ProductFormModal from "../../components/modals/ProductFormModal";
import { getCampaign } from "../../api/campaignApi";

export default function CampaignDetails() {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pickerOpen, setPickerOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [campaign, setCampaign] = useState(null);

  const fetchProducts = async () => {
    try {
      const data = await getCampaignProducts(id);

      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();

    fetchProducts();
  }, [id]);

  const handleAddProduct = async (data) => {
    try {
      await addCampaignProduct(id, data);

      toast.success("محصول با موفقیت اضافه شد");

      setFormOpen(false);

      setSelectedProduct(null);

      await fetchProducts();
    } catch (err) {

      toast.error("خطا در افزودن محصول");

      console.error(err);

    }
  }
  const fetchCampaign = async () => {

    try {

      const data = await getCampaign(id);

      setCampaign(data);

    }

    catch (err) {

      console.log(err);

    }

  };

  if (loading) return <h2>در حال بارگذاری...</h2>;




  return (
    <div>
      <h1>مدیریت کمپین</h1>
      {campaign && (

        <div className="campaign-info-card">

          <div>

            <h1>

              {campaign.title}

            </h1>

            <span>

              {campaign.status}

            </span>

          </div>

          <p>

            ساختمان :

            {campaign.building.buildingName}

          </p>

          <p>

            مدیر :

            {campaign.manager.fullName}

          </p>

          <p>

            ایجاد :

            {

              new Date(

                campaign.createdAt

              ).toLocaleDateString("fa-IR")

            }

          </p>

          <p>

            مهلت پرداخت :

            {

              new Date(

                campaign.paymentDeadline

              ).toLocaleDateString("fa-IR")

            }

          </p>

        </div>

      )}
      <ProductTable
        products={products}
        onAddProduct={() => setPickerOpen(true)}
      />

      <ProductPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
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
    </div>
  );
};
