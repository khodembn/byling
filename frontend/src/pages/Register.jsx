import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/login.css";

export default function Register() {

  const [role, setRole] = useState("user");

  // مشترک
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // manager
  const [buildingName, setBuildingName] = useState("");
  const [address, setAddress] = useState("");

  // user
  const [floorNumber, setFloor] = useState("");
  const [unitNumber, setUnit] = useState("");

  const handleRegister = async () => {

    try {

      let url = "";
      let data = {};

      if (role === "manager") {

        url = "/auth/register-manager";

        data = {
          fullName,
          mobile,
          password,
          buildingName,
          postalCode,
          address,
        };

      } else {

        url = "/auth/register-user";

        data = {
          fullName,
          mobile,
          password,
          postalCode,
          floorNumber,
          unitNumber,
        };

      }

      await api.post(url, data);

      alert("ثبت نام با موفقیت انجام شد");

      window.location.href = "/login";

    } catch (err) {

      console.log(err.response?.data);

      alert(err.response?.data?.message || "خطا در ثبت نام");

    }

  };

  return (
    <div className="login-wrapper">

      <div className="login-card">

        <div className="login-logo">
          By<span>ling</span>
        </div>

        <h1>ثبت نام</h1>

        <div className="role-selector">

          <button
            type="button"
            className={role === "user" ? "role-btn active" : "role-btn"}
            onClick={() => setRole("user")}
          >
            کاربر ساختمان
          </button>

          <button
            type="button"
            className={role === "manager" ? "role-btn active" : "role-btn"}
            onClick={() => setRole("manager")}
          >
            مسئول خرید
          </button>

        </div>

        <input
          className="login-input"
          placeholder="نام و نام خانوادگی"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="شماره موبایل"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="کد پستی"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        {role === "manager" && (
          <>
            <input
              className="login-input"
              placeholder="نام ساختمان"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
            />

            <input
              className="login-input"
              placeholder="آدرس ساختمان"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </>
        )}

        {role === "user" && (
          <>
            <input
              className="login-input"
              placeholder="شماره طبقه"
              value={floorNumber}
              onChange={(e) => setFloor(e.target.value)}
            />

            <input
              className="login-input"
              placeholder="شماره واحد"
              value={unitNumber}
              onChange={(e) => setUnit(e.target.value)}
            />
          </>
        )}

        <button
          className="login-btn2"
          onClick={handleRegister}
        >
          ثبت نام
        </button>

        <div className="top-message">
          حساب کاربری دارید؟
          <Link to="/login"> وارد شوید </Link>
        </div>
      </div>

    </div>
  );
}