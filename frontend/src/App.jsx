import "./App.css";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminProductDetail from "@/components/admin/AdminProductDetail";
import HomePage from "@/components/admin/HomePage";
import InfoPage from "@/components/admin/InfoPage";
import OrdersPage from "@/components/admin/OrdersPage";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUserData } from "@/context/use-user-data";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderPage from "@/pages/OrderPage";
import OrderProcessing from "@/pages/OrderProcessing";
import Orders from "@/pages/Orders";
import Payment from "@/pages/Payment";
import ProductPage from "@/pages/ProductPage";
import Products from "@/pages/Products";
import Verify from "@/pages/Verify";

// Chặn admin truy cập các trang dành cho user thường
const UserOnlyRoute = ({ children }) => {
  const { isAuth, loading, user } = useUserData();
  if (loading) return <Loading />;
  if (isAuth && user?.role === "admin")
    return <Navigate to="/admin/dashboard" />;
  return children;
};

// Layout có Navbar + Footer (dành cho user)
const UserLayout = ({ children }) => (
  <div className="flex flex-col min-h-dvh pt-16">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  const { loading } = useUserData();

  if (loading) return <Loading />;

  return (
    <>
      <Routes>
        {/* Routes dành cho user — có Navbar + Footer */}
        <Route
          element={
            <UserLayout>
              <Routes>
                <Route
                  element={
                    <UserOnlyRoute>
                      <Home />
                    </UserOnlyRoute>
                  }
                  path="/"
                />
                <Route
                  element={
                    <ProtectedRoute publicOnly>
                      <Login />
                    </ProtectedRoute>
                  }
                  path="/login"
                />
                <Route
                  element={
                    <ProtectedRoute publicOnly>
                      <Verify />
                    </ProtectedRoute>
                  }
                  path="/verify"
                />
                <Route
                  element={
                    <UserOnlyRoute>
                      <Products />
                    </UserOnlyRoute>
                  }
                  path="/products"
                />
                <Route element={<ProductPage />} path="/product/:id" />
                <Route
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                  path="/orders"
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <OrderPage />
                    </ProtectedRoute>
                  }
                  path="/order/:id"
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                  path="/cart"
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                  path="/checkout"
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                  path="/payment/:id"
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <OrderProcessing />
                    </ProtectedRoute>
                  }
                  path="/order/success"
                />
                <Route element={<NotFound />} path="*" />
              </Routes>
            </UserLayout>
          }
          path="/*"
        />

        {/* Routes dành cho admin — không có Navbar + Footer */}
        <Route
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route element={<InfoPage />} path="/admin/dashboard" />
          <Route element={<HomePage />} path="/admin/products" />
          <Route element={<AdminProductDetail />} path="/admin/products/:id" />
          <Route element={<OrdersPage />} path="/admin/orders" />
        </Route>
        <Route
          element={
            <ProtectedRoute publicOnly>
              <AdminLogin />
            </ProtectedRoute>
          }
          path="/admin/login"
        />
        <Route element={<Navigate to="/admin/dashboard" />} path="/admin/*" />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}

export default App;
