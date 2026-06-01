import "./App.css";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Verify from "@/pages/Verify";

function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Verify />} path="/verify" />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
