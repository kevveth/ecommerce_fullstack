import { PropsWithChildren } from "react";
import { Navbar } from "./Navbar/Navbar";
import { Outlet } from "react-router";

type PageLayoutProps = PropsWithChildren;

export function PageLayout() {
  return (<div className="">
    <Navbar />
    <Outlet />
    {/* <Footer /> */}
    </div>);
}
