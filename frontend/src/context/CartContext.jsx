import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { CartContext } from "@/context/cart-context";

const SERVER = import.meta.env.VITE_SERVER_URL;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  const fetchCart = useCallback(async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const { data } = await axios.get(`${SERVER}/api/cart/all`, {
        headers: { token },
      });
      setCart(data.cart);
      setTotalItem(data.sumOfQuantity);
      setSubTotal(data.subTotal);
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function addToCart(productId) {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      const { data } = await axios.post(
        `${SERVER}/api/cart/add`,
        { product: productId },
        { headers: { token } },
      );
      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
    }
  }

  useEffect(() => {
    let ignore = false;

    const loadCart = async () => {
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const { data } = await axios.get(`${SERVER}/api/cart/all`, {
          headers: { token },
        });

        if (ignore) return;

        setCart(data.cart);
        setTotalItem(data.sumOfQuantity);
        setSubTotal(data.subTotal);
      } catch (error) {
        console.log(error);
      }
    };

    loadCart();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        addToCart,
        cart,
        fetchCart,
        setTotalItem,
        subTotal,
        totalItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
