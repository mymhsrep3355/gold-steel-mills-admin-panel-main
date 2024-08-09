

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {RootLayout} from "./pages/RootLayout.jsx";
import {Suppliers} from "./pages/supplier/Suppliers.jsx";
import {Purchases} from "./pages/purchase/Purchases.jsx";
import {Dashboard} from "./pages/Dashboard.jsx";
import {SupplierEdit} from "./pages/supplier/Edit.jsx";
import {AuthLayout} from "./pages/AuthLayout.jsx";
import {LoginPage} from "./pages/Auth/LoginPage.jsx";
import {AuthProvider} from "./services/AuthProvider.jsx";
import {PurchaseEdit} from "./pages/purchase/Edit.jsx";
import BillComponent from "./pages/Bills/BillComponent.jsx";
import ExpenseTracking from "./pages/Expenses/ExpenseTracking.jsx";
import SuppliesLoadingForm from "./pages/WGS-Supplies/SuppliesLoadingForm.jsx";
import LandingPageLayout from "./pages/LandingPageLayout.jsx";

const router = createBrowserRouter([
    {
        path: "/landing",
        element: <LandingPageLayout/>,
    },
    {
        path:'/auth',
        element:<AuthLayout/>,
        children:[
            {
                path:'login',
                element: <LoginPage/>,

            }
        ]
    },
    {
        path: "/",
        element: <RootLayout/>,
        children:[
            {
                path:'/',
                element:<Dashboard/>
            },
            {
                path:'/suppliers',
                element:<Suppliers/>
            },
            {

                path: '/bills',
                element: <BillComponent/>
            },
            {
                path: '/expenses',
                element: <ExpenseTracking/>
            },
            {
                path: '/supplies',
                element: <SuppliesLoadingForm/>
            },
            {
                path:'/purchases',
                element:<Purchases/>
            },
            {
                path:'/supplier/edit',
                element:<SupplierEdit/>
            },
            {
                path:'/purchase/edit',
                element:<PurchaseEdit/>
            }
        ]
    },
]);
function App() {
  return (
      <div className={'flex justify-center'}>
            <div className={'max-w-[1400px] w-[1400px]  '}>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </div>
      </div>
  )
}

export default App
