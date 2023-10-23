import { type LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import sidebarCss from 'app/routes/__sidebar/style.css'
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: sidebarCss },
]
export const Sidebar = () => {
  return (<div className="sidenav">
    Sidebar
  </div>)
}
const Index = () => {
  return (
    <>
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};
export default Index;
