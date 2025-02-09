import { PropsWithChildren } from "react";
import { Navbar } from "./Navbar/Navbar";

type PageLayoutProps = PropsWithChildren;

export function PageLayout({ children }: PageLayoutProps) {
  return (<div className="">
    <Navbar />
    { children }
    {/* <Footer /> */}
    </div>);
}
