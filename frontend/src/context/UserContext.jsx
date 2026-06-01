import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import toast from "react-hot-toast";

import { UserContext } from "@/context/user-context";

const SERVER = import.meta.env.VITE_SERVER_URL;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem("token"));

  async function loginUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${SERVER}/api/user/login`, { email });
      toast.success(data.message);
      localStorage.setItem("email", email);
      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
    } finally {
      setBtnLoading(false);
    }
  }

  async function verifyUser(otp, navigate) {
    setBtnLoading(true);
    try {
      const email = localStorage.getItem("email");
      const { data } = await axios.post(`${SERVER}/api/user/verify`, {
        email,
        otp,
      });
      toast.success(data.message);
      localStorage.removeItem("email");
      localStorage.setItem("token", data.token);
      setIsAuth(true);
      setUser(data.user);
      Cookies.set("token", data.token, {
        expires: 15,
        path: "/",
        secure: location.protocol === "https:",
      });
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
    } finally {
      setBtnLoading(false);
    }
  }

  function logoutUser() {
    localStorage.removeItem("token");
    Cookies.remove("token", {
      path: "/",
      secure: location.protocol === "https:",
    });
    setIsAuth(false);
    setUser([]);
    toast.success("Đã đăng xuất");
  }

  return (
    <UserContext.Provider
      value={{
        btnLoading,
        isAuth,
        loginUser,
        logoutUser,
        user,
        verifyUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
