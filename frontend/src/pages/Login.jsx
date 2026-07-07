
import { useState } from "react";
import api from "../api/axios";
import "../styles/login.css";
import { Link } from "react-router-dom";



export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        mobile,
        password,
      });

     // console.log("LOGIN SUCCESS:", res.data);

   
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";

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
