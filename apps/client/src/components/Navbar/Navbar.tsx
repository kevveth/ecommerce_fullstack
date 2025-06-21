import { SignOut } from "@/features/auth/SignOut/SignOut";
import { authClient } from "@/utils/auth-client";
import { Link, Route } from "react-router";
import styles from "./styles.module.css";

const routes = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  signOut: "/sign-out",
  profile: "/profile",
  products: "/products",
} as const;

type TypeOfRoutes = typeof routes;
type RouteKeys = keyof TypeOfRoutes;
type Route = (typeof routes)[RouteKeys];

type NavItem = {
  to: Route;
  label: string;
};

export function NavBar() {
  //   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const publicItems: NavItem[] = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
  ];

  const unAuthItems: NavItem[] = [
    { to: "/sign-in", label: "Sign In" },
    { to: "/sign-up", label: "Sign Up" },
  ];

  const authItems: NavItem[] = [{ to: "/profile", label: "My Profile" }];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logo}>
            MyShop
          </Link>
        </div>

        <ul className={styles.navList}>
          {listItems(publicItems)}
          {!session ? (
            listItems(unAuthItems)
          ) : (
            <>
              {listItems(authItems)}
              <li key={"sign-out"} className={styles.navItem}>
                <SignOut />
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

const listItems = (items: NavItem[]) => {
  return items.map((item) => (
    <li key={item.to} className={styles.navItem}>
      <Link to={item.to} className={styles.navLink}>
        {item.label}
      </Link>
    </li>
  ));
};
