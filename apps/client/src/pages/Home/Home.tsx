import styles from "./Home.module.css";

export const Home = () => {
  return (
    <div className={styles.homeContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Ken's Coffee Company</h1>
          <p className={styles.heroTagline}>Craft Coffee, Extraordinary Flavor</p>
          <button className={styles.ctaButton}>Shop Now</button>
        </div>
      </section>
      
      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Our Story</h2>
          <p className={styles.sectionText}>
            At Ken's Coffee Company, we believe that great coffee is an art form. 
            Since 2015, we've been sourcing premium beans from sustainable farms,
            carefully roasting them to perfection, and delivering exceptional flavor
            in every cup. Our passion for quality and craftsmanship is at the heart
            of everything we do.
          </p>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>Featured Blends</h2>
        <div className={styles.productGrid}>
          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <h3>Morning Sunrise Blend</h3>
            <p>A bright, balanced medium roast with notes of citrus and chocolate.</p>
            <span className={styles.productPrice}>$16.99</span>
          </div>
          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <h3>Midnight Espresso</h3>
            <p>Rich, bold dark roast with notes of caramel and toasted nuts.</p>
            <span className={styles.productPrice}>$18.99</span>
          </div>
          <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <h3>Highland Reserve</h3>
            <p>Single-origin light roast with floral notes and subtle fruitiness.</p>
            <span className={styles.productPrice}>$21.99</span>
          </div>
        </div>
        <button className={styles.secondaryButton}>View All Products</button>
      </section>
      
      {/* Visit Us Section */}
      <section className={styles.visitSection}>
        <div className={styles.visitContent}>
          <div className={styles.visitInfo}>
            <h2 className={styles.sectionTitle}>Visit Our Café</h2>
            <p className={styles.sectionText}>
              Experience our coffee in person at our flagship café. Enjoy 
              freshly brewed coffee, house-made pastries, and a cozy atmosphere 
              perfect for working or meeting friends.
            </p>
            <address className={styles.address}>
              123 Coffee Lane, Brewville<br />
              Open Daily 6am-8pm
            </address>
          </div>
          <div className={styles.visitMap}></div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterContent}>
          <h2 className={styles.sectionTitle}>Stay Connected</h2>
          <p>Subscribe to our newsletter for special offers and brewing tips</p>
          <form className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className={styles.emailInput} 
              required 
            />
            <button type="submit" className={styles.subscribeButton}>
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
