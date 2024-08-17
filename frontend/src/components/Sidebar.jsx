import { SidebarTab } from "./SidebarTab.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { routes } from "../routes.js";
import { Button } from "./Button.jsx";
import { useAuthProvider } from "../hooks/useAuthProvider.js";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const { logout } = useAuthProvider();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  useEffect(() => {
    
    const path = location.pathname.split("/")[1];
    setActive(!path ? "dashboard" : path);
  }, [location]);

  return (
    <div className={"w-full flex flex-col gap-4"}>
      <div className={"flex items-center justify-center"}>
        <img style={{ width: 170, height: 170 }} src="/logo.jpeg" alt="Logo" />
      </div>
      {routes.map((route, index) => {
        const IconComponent = route.icon;
        return (
          <Link key={index} to={route.routeURL}>
            <SidebarTab title={route.name} active={active} setActive={setActive}>
              <IconComponent style={{ fontSize: "18px" }} className={"text-slate-700"} />
            </SidebarTab>
          </Link>
        );
      })}

      <Button title={"Logout"} onClickHandler={handleLogout} />
    </div>
  );
};
