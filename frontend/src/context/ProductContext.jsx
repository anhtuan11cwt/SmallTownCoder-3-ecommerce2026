import axios from "axios";
import { useEffect, useState } from "react";

import { ProductContext } from "@/context/product-context";

const SERVER = import.meta.env.VITE_SERVER_URL;

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${SERVER}/api/product/all`);
        setProducts(data.products);
        setNewProd(data.newProducts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ loading, newProd, products }}>
      {children}
    </ProductContext.Provider>
  );
};
