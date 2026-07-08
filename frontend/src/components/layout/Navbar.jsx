import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {

  const { user } = useAuth();

  return (

    <header className="navbar-dashboard">

      <div>
    سلام {user?.fullName || "کاربر"}
      </div>

      <div>
        {user?.role === "PURCHASE_MANAGER"
          ? "مسئول خرید"
          : "ساکن ساختمان"}
      </div>

    </header>

  );

}