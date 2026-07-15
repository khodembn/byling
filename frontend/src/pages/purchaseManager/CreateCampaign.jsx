import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCampaign } from "../../api/campaignApi";

import "../../styles/CreateCampaign.css";

export default function CreateCampaign() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    paymentDeadline: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createCampaign(form);

      alert("کمپین با موفقیت ایجاد شد.");

      navigate("/purchase/campaigns");
    } catch (err) {
      console.error(err);

      alert("خطا در ایجاد کمپین");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-campaign-page">

      <h1>ایجاد کمپین</h1>

      <form onSubmit={handleSubmit}>

        <div>

          <label>عنوان کمپین</label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

        </div>

        <div>

          <label>مهلت پرداخت</label>

          <input
            type="datetime-local"
            name="paymentDeadline"
            value={form.paymentDeadline}
            onChange={handleChange}
          />

        </div>

        <button disabled={loading}>
          {loading ? "در حال ایجاد..." : "ایجاد کمپین"}
        </button>

      </form>

    </div>
  );
}