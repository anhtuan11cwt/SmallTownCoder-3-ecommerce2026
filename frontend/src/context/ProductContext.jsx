import axios from "axios";
import { useEffect, useState } from "react";

import { ProductContext } from "@/context/product-context";

const SERVER = import.meta.env.VITE_SERVER_URL;

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${SERVER}/api/product/all?page=${page}`;

        if (search) url += `&search=${search}`;
        if (category) url += `&category=${category}`;
        if (price) url += `&sortByPrice=${price}`;

        const { data } = await axios.get(url);
        setProducts(data.products);
        setNewProd(data.newProducts);
        setCategories(data.categories);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [search, category, price, page]);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setPrice("");
    setPage(1);
  }

  return (
    <ProductContext.Provider
      value={{
        categories,
        category,
        clearFilters,
        loading,
        newProd,
        page,
        price,
        products,
        search,
        setCategory,
        setLoading,
        setPage,
        setPrice,
        setSearch,
        totalPages,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
