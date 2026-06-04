import "./App.css";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { useUserData } from "@/context/use-user-data";
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

function App() {
  const { isAuth, loading } = useUserData();

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={isAuth ? <Home /> : <Login />} path="/login" />
          <Route element={isAuth ? <Home /> : <Verify />} path="/verify" />
          <Route element={<Products />} path="/products" />
          <Route element={<ProductPage />} path="/product/:id" />
          <Route
            element={isAuth ? <Orders /> : <Navigate to="/login" />}
            path="/orders"
          />
          <Route
            element={isAuth ? <OrderPage /> : <Navigate to="/login" />}
            path="/order/:id"
          />
          <Route
            element={isAuth ? <Cart /> : <Navigate to="/login" />}
            path="/cart"
          />
          <Route
            element={isAuth ? <Checkout /> : <Navigate to="/login" />}
            path="/checkout"
          />
          <Route
            element={isAuth ? <Payment /> : <Navigate to="/login" />}
            path="/payment/:id"
          />
          <Route
            element={isAuth ? <OrderProcessing /> : <Navigate to="/login" />}
            path="/order/success"
          />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
