import PageLayout from "../components/PageLayout";
import "../App.css";
import styles from "./Home.module.css";

export const Home = () => {
  return (
    <PageLayout pageTitle="Welcome to Ken's Coffee Company">
      <div className="coffee-bg">
        <section className="container">
          <h1 className={styles.homeTitle}>Freshly Roasted Perfection</h1>
          <p className="coffee-text">
            Discover the rich, aromatic blends and exceptional coffee
            experiences that have made Ken's Coffee Company a favorite among
            coffee enthusiasts.
          </p>

          <div className={`grid ${styles.featuresGrid}`}>
            <div className={`card ${styles.featureCard}`}>
              <h3 className="coffee-subtitle">Premium Beans</h3>
              <p>
                Our beans are ethically sourced from the finest coffee regions
                around the world, ensuring exceptional quality in every cup.
              </p>
            </div>

            <div className={`card ${styles.featureCard}`}>
              <h3 className="coffee-subtitle">Expert Roasting</h3>
              <p>
                Small-batch roasting by our master roasters brings out the
                unique characteristics and flavors of each coffee variety.
              </p>
            </div>

            <div className={`card ${styles.featureCard}`}>
              <h3 className="coffee-subtitle">Community Focus</h3>
              <p>
                We believe in creating lasting relationships with our farmers,
                customers, and communities through sustainable practices.
              </p>
            </div>
          </div>

          <div className={`card ${styles.visitCard}`}>
            <h2 className="coffee-subtitle">Visit Our Shop</h2>
            <p>
              Join us at our café to experience our signature coffees and
              house-made pastries in a warm, inviting atmosphere designed for
              connection and comfort.
            </p>
            <p className={styles.address}>
              123 Coffee Lane, Brewville • Open Daily 6am-8pm
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};
