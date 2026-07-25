import "../../styles/home.css";
import heroImage from "../../assets/images/hero.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">

      {/* Header */}

      <header className="navbar">

        <div className="logo">
          By<span>ling</span>
        </div>

        <div className="auth-buttons">

          <Link to="/login">
            <button className="login-btn">
              ورود
            </button>
          </Link>

          <Link to="/register">
            <button className="register-btn">
              ثبت نام
            </button>
          </Link>

        </div>

      </header>

      {/* Hero */}

      <section
        className="hero"
        style={{
          backgroundImage: `
                    linear-gradient(rgba(15,45,68,.85),rgba(15,45,68,.85)),
                    url(${heroImage})
                `
        }}
      >

        <div className="hero-content">

          <span className="hero-badge">
            خرید گروهی هوشمند
          </span>

          <h1>
            خرید گروهی
            <br />
            برای ساکنین ساختمان
          </h1>

          <p>
            همسایه‌ها سفارش خود را ثبت می‌کنند،
            با رسیدن به حد نصاب کالا با قیمت عمده خریداری
            شده و هزینه ارسال بین همه تقسیم می‌شود.
          </p>

          <Link to="/register">
            <button className="hero-btn">
              شروع رایگان
            </button>
          </Link>

        </div>

      </section>

      {/* Features */}

      <section className="features">

        <h2>چرا Byling ؟</h2>

        <div className="features-grid">

          <div className="feature-card">
            <div className="icon">💰</div>
            <h3>صرفه‌جویی در هزینه</h3>
            <p>
              خرید کالا با قیمت عمده
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">👥</div>
            <h3>خرید گروهی</h3>
            <p>
              مشارکت همه ساکنین ساختمان
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">🚚</div>
            <h3>تحویل یکجا</h3>
            <p>
              ارسال سفارش‌ها به ساختمان
            </p>
          </div>

        </div>

      </section>

      {/* Steps */}

      <section className="steps">

        <h2>نحوه عملکرد</h2>

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

      {/* Statistics */}

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
          <p>میانگین صرفه‌جویی</p>
        </div>

      </section>

      {/* CTA */}

      <section className="cta">

        <h2>
          آماده‌ای خرید هوشمند را شروع کنی؟
        </h2>

        <Link to="/register">
          <button>
            ثبت نام رایگان
          </button>
        </Link>

      </section>

      {/* Footer */}

      <footer className="footer">

        <div className="logo">
          By<span>ling</span>
        </div>

        <p>
          © 2026 تمامی حقوق محفوظ است.
        </p>

      </footer>

    </div>
  );
}