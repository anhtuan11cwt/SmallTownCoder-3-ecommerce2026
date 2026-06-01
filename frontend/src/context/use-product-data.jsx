import { useContext } from "react";

import { ProductContext } from "@/context/product-context";

export const useProductData = () => useContext(ProductContext);
