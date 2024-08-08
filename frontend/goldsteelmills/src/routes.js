import {
  FaHome,
  FaTruck,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
  FaSignInAlt,
} from "react-icons/fa";

export const routes = [
  {
    name: "Home",
    icon: FaHome,
    routeURL: "/",
  },
  {
    name: "Suppliers",
    icon: FaTruck,
    routeURL: "/suppliers",
  },
  {
    name: "Purchases",
    icon: FaShoppingCart,
    routeURL: "/purchases",
  },
  {
    name: "Sales Invoices",
    icon: FaFileInvoiceDollar,
    routeURL: "/bills",
  },
  {
    name: "Expense Tracker",
    icon: FaMoneyCheckAlt,
    routeURL: "/expenses",
  },
  {
    name: "Supplies Tracker",
    icon: FaMoneyCheckAlt,
    routeURL: "/supplies",
  },
  {
    name: "Logout",
    icon: FaSignInAlt,
    routeURL: "/auth/login",
  },
];
