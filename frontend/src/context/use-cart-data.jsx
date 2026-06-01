import { useContext } from "react";

import { CartContext } from "@/context/cart-context";

export const useCartData = () => useContext(CartContext);
