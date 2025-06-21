import { SignOut } from "@/features/auth/SignOut/SignOut";
import { authClient } from "@/utils/auth-client";
import { Link, Route } from "react-router";

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
    <nav>
      <ul>
        {listItems(publicItems)}
        {!session ? (
          listItems(unAuthItems)
        ) : (
          <>
            {listItems(authItems)}
            <li key={"sign-out"}>
              <SignOut />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

const listItems = (items: NavItem[]) => {
  return items.map((item) => (
    <li key={item.to}>
      <Link to={item.to}>{item.label}</Link>
    </li>
  ));
};
