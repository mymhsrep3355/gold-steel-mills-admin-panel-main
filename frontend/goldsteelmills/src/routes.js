import {
  HomeOutlined,
  RiseOutlined,
  UserSwitchOutlined,

} from "@ant-design/icons";

import { FaMoneyBills } from "react-icons/fa6";

export const routes = [
  {
    name: "Dashboard",
    icon: HomeOutlined,
    routeURL: "/",
  },
  {
    name: "Suppliers",
    icon: UserSwitchOutlined,
    routeURL: "/suppliers",
  },
  {
    name: "Purchases",
    icon: RiseOutlined,
    routeURL: "/purchases",
  },
  {
    name: "Bills",
    icon: FaMoneyBills,
    routeURL: "/bills",
  },
  {
    name: "Login",
    icon: RiseOutlined,
    routeURL: "/auth/login",
  },
];
