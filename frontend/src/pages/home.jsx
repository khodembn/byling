import "../styles/home.css";
import heroImage from "../images/hero.png";
import { Link } from "react-router-dom";



export default function Home() {
  return (
    <div className="home">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          By<span>ling</span>
        </div>

        <ul className="nav-links">
          <li>خانه</li>
          <li>خریدها</li>
          <li>اطلاعیه‌ها</li>
          <li>سبد خرید</li>
        </ul>
        <Link to="/register">
        <button className="login-btn">
          ورود
        </button>
</Link>
        
      </nav>

      {/* HERO */}

      <section className="hero"
        style={{
    backgroundImage: `
      linear-gradient(
        rgba(15,45,68,.82),
        rgba(15,45,68,.82)
      ),
      url(${heroImage})
    `
  }}
  >

        <div className="hero-overlay">

          <div className="hero-content">

            <span className="hero-badge">
              خرید گروهی هوشمند
            </span>

            <h1>
              خرید گروهی
              <br />
              برای اهالی ساختمان
            </h1>

            <p>
              با ثبت سفارش همسایه‌ها، قیمت کالا به قیمت عمده می‌رسد
              و هزینه‌ها بین همه تقسیم می‌شود.
            </p>

            <button className="hero-btn">
              شروع خرید
            </button>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="features">

        <h2>چرا Byling ؟</h2>

        <div className="features-grid">

          <div className="feature-card">
            <div className="icon">💰</div>
            <h3>کاهش هزینه</h3>
            <p>
              خرید مستقیم با قیمت عمده
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">🚚</div>
            <h3>ارسال یکجا</h3>
            <p>
              تحویل درب ساختمان
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">👥</div>
            <h3>خرید جمعی</h3>
            <p>
              همکاری بین همسایه‌ها
            </p>
          </div>

        </div>

      </section>

      {/* STEPS */}

      <section className="steps">

        <h2>نحوه کار</h2>

        <div className="steps-grid">

          <div className="step-card">
            <span>1</span>
            <h3>ثبت ساختمان</h3>
          </div>

          <div className="step-card">
            <span>2</span>
            <h3>دعوت همسایه‌ها</h3>
          </div>

          <div className="step-card">
            <span>3</span>
            <h3>ثبت سفارش</h3>
          </div>

          <div className="step-card">
            <span>4</span>
            <h3>تحویل کالا</h3>
          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="stats">

        <div className="stat-box">
          <h3>500+</h3>
          <p>ساختمان فعال</p>
        </div>

        <div className="stat-box">
          <h3>12000+</h3>
          <p>سفارش موفق</p>
        </div>

        <div className="stat-box">
          <h3>30%</h3>
          <p>صرفه‌جویی متوسط</p>
        </div>

      </section>

      {/* CTA */}

      <section className="cta">

        <h2>
          آماده‌ای ارزان‌تر خرید کنی؟
        </h2>

        <button>
          شروع ثبت سفارش
        </button>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <div className="logo">
          By<span>ling</span>
        </div>

        <p>
          © 2026 تمامی حقوق محفوظ است
        </p>

      </footer>

    </div>
  );
}