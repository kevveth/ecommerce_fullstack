import { Navbar } from "./Navbar/Navbar";
import { Outlet } from "react-router";


export function PageLayout() {
  return (<div className="">
    <Navbar />
    <Outlet />
    {/* <Footer /> */}
    </div>);
}
