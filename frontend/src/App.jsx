import "./App.css";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { useUserData } from "@/context/use-user-data";
import Cart from "@/pages/Cart";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
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
          <Route
            element={isAuth ? <Cart /> : <Navigate to="/login" />}
            path="/cart"
          />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
