import { Outlet } from "@remix-run/react";

const Index = () => {
  return (
    <>
      <h1>SIDEBAR</h1>
      <Outlet />
    </>
  );
};
export default Index;
