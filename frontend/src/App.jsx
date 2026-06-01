import "./App.css";
import { Route, Routes } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Login from "@/pages/Login";

function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
