import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* Features */}
      <section className="home-features">

        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Get your products delivered quickly and safely.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Payment</h3>
          <p>Your payment information is safe and secure.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>Quality Products</h3>
          <p>We provide quality products at great prices.</p>
        </div>

      </section>


      {/* Explore Products */}
      <section className="home-shop">

        <div className="home-shop-content">

          <span className="section-label">
            START SHOPPING
          </span>

          <h2>
            Everything You Need,
            <br />
            All in One Place
          </h2>

          <p>
            Browse our complete collection and find the
            right products for you.
          </p>

          <Link
            to="/products"
            className="home-shop-button"
          >
            Explore Products
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;