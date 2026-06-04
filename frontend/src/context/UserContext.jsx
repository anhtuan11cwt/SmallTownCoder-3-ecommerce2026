import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CartContext } from "@/context/cart-context";
import { UserContext } from "@/context/user-context";

const SERVER = import.meta.env.VITE_SERVER_URL;

export const UserProvider = ({ children }) => {
  const { fetchCart } = useContext(CartContext);
  const [user, setUser] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem("token"));
  const [loading, setLoading] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${SERVER}/api/user/me`, {
          headers: { token },
        });
        setIsAuth(true);
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        Cookies.remove("token", { path: "/" });
        setIsAuth(false);
        setUser([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, []);

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

  async function loginAdmin(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${SERVER}/api/user/admin/login`, {
        email,
        password,
      });
      toast.success("Đăng nhập Admin thành công");
      localStorage.setItem("token", data.token);
      Cookies.set("token", data.token, {
        expires: 15,
        path: "/",
        secure: location.protocol === "https:",
      });
      setIsAuth(true);
      setUser(data.user);
      navigate("/admin/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Email hoặc mật khẩu không đúng";
      toast.error(message);
      // eslint rule: require { cause } when throwing the caught error
      throw new Error(message, { cause: error });
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
      fetchCart();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
    } finally {
      setBtnLoading(false);
    }
  }

  function logoutUser(navigate) {
    localStorage.removeItem("token");
    Cookies.remove("token", {
      path: "/",
      secure: location.protocol === "https:",
    });
    setIsAuth(false);
    setUser([]);
    toast.success("Đã đăng xuất");
    navigate("/login");
  }

  return (
    <UserContext.Provider
      value={{
        btnLoading,
        isAuth,
        loading,
        loginAdmin,
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
