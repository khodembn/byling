
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/login.css";
import { Link } from "react-router-dom";



export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
    const res = await api.post("/auth/login", {
    mobile,
    password,
});

    login(res.data.token, res.data.user);

    if (res.data.user.role === "PURCHASE_MANAGER") {
      navigate("/purchase/dashboard");
    }  else {
      navigate("/resident/dashboard");
    }

    } catch (err) {
      setMessage(err.response?.data?.message || "خطا در ورود");
    }
  };


  return (
    <div className="login-wrapper">
      <div className="login-card">

        <div className="login-logo">
          By<span>ling</span>
        </div>

        <h1>ورود به حساب کاربری</h1>

        <p>خرید گروهی عمده برای اهالی ساختمان</p>

        <input
          className="login-input"
          type="text"
          placeholder="شماره موبایل"
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="رمز عبور"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn2" onClick={handleLogin}>
          ورود به حساب
        </button>

        <div className="login-message">
          {message}
        </div>

        <div className="login-footer">
        با ورود به سامانه، قوانین و شرایط استفاده از سامانه را می‌پذیرم
        </div>
        <div className="top-message">
          هنوز ثبت نام نکرده‌اید؟
    <Link to="/register"> ثبت نام کنید </Link>

    </div>
  
    </div>

    </div>
  );
}
