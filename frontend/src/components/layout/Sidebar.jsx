import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";



export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  console.log("Sidebar cartCount:", cartCount);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <aside className="sidebar">

      <div className="logo">
        By<span>ling</span>
      </div>

      <nav>

        {user?.role === "PURCHASE_MANAGER" ? (
          <>
            <Link to="/purchase/dashboard">داشبورد</Link>

            <Link to="/purchase/campaigns">
              کمپین‌ها
            </Link>

            <Link to="/purchase/orders">
              سفارش‌ها
            </Link>

            <Link to="/purchase/residents">
              ساکنین
            </Link>
          </>
        ) : (
          <>
            <Link to="/resident/dashboard">
              داشبورد
            </Link>

            <Link to="/resident/campaigns">
              کمپین‌ها
            </Link>

            <Link to="/resident/orders">
              سفارش‌های من
            </Link>
            <Link to="/resident/cart">

              سبد خرید

              {

                cartCount > 0 &&

                (

                  <span className="cart-badge">

                    {cartCount}

                  </span>

                )

              }

            </Link>

            <Link to="/resident/payments">
              پرداخت ها
            </Link>

            <Link to="/resident/notifications">
              اعلان ها
            </Link>


          </>
        )}

      </nav>

      <button onClick={handleLogout}>
        خروج
      </button>

    </aside>
  );
}