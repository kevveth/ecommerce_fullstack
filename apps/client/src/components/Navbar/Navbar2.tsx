import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { authClient } from "@/utils/auth-client";
import { Button } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import {
  Menu,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  CoffeeIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface ProductCategory {
  title: string;
  href: string;
  description: string;
}

const productCategories: ProductCategory[] = [
  {
    title: "All Products",
    href: "/products",
    description: "Browse our complete collection of premium coffee products",
  },
  {
    title: "Coffee Beans",
    href: "/products/beans",
    description: "Premium coffee beans from around the world",
  },
  {
    title: "Equipment",
    href: "/products/equipment",
    description: "Brewing equipment and accessories",
  },
  {
    title: "Merchandise",
    href: "/products/merchandise",
    description: "Mugs, apparel, and coffee accessories",
  },
];

export function NavBar2() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Authentication state
  const { data: session, isPending } = authClient.useSession();

  const signOutMutation = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <CoffeeIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Ken's Coffee</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink>Home</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      {productCategories.map((category) => (
                        <NavigationMenuLink key={category.href} asChild>
                          <Link to={category.href}>
                            <div className="font-medium">{category.title}</div>
                            <p className="text-muted-foreground text-xs leading-snug">
                              {category.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink>About</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink>Contact</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Shopping cart */}
            <Button variant="outline" size="icon" asChild>
              <Link to="/cart">
                <ShoppingCart />
              </Link>
            </Button>
            {/* Authentication */}
            {isPending ? (
              <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar>
                      <AvatarImage
                        src={session.user.image || undefined}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback>
                        {getUserInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div>
                      <p>{session.user.name}</p>
                      <p>{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={signOutMutation.isPending}
                    variant="destructive"
                  >
                    <LogOut />
                    {signOutMutation.isPending ? "Signing out..." : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant={"ghost"} asChild>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Link
                    to="/"
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>

                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                      Products
                    </div>
                    <div className="pl-6 space-y-1">
                      {productCategories.map((category) => (
                        <Link
                          key={category.href}
                          to={category.href}
                          className="block px-3 py-2 rounded-md text-sm hover:bg-accent"
                          onClick={() => setIsOpen(false)}
                        >
                          {category.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link
                    to="/about"
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>

                  {/* Mobile auth */}
                  {session?.user.name ? (
                    <div className="pt-4 border-t space-y-2">
                      <div className="px-3 py-2">
                        <Avatar>
                          <AvatarImage
                            src={session.user.image || undefined}
                            alt={session.user.name || "User"}
                          />
                          <AvatarFallback>
                            {getUserInitials(session?.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-3 py-2 rounded-md text-sm hover:bg-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={handleSignOut}
                        disabled={signOutMutation.isPending}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {signOutMutation.isPending
                          ? "Signing out..."
                          : "Sign out"}
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4 px-3 border-t space-y-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/sign-in" onClick={() => setIsOpen(false)}>
                          <User className="h-4 w-4" />
                          Sign In
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link to="/sign-up" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
