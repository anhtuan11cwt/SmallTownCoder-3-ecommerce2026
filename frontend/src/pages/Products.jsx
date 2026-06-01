import { Filter, X } from "lucide-react";
import { useState } from "react";

import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useProductData } from "@/context/use-product-data";

const Products = () => {
  const [show, setShow] = useState(false);

  const {
    categories,
    category,
    clearFilters,
    loading,
    page,
    price,
    products,
    search,
    setCategory,
    setPage,
    setPrice,
    setSearch,
    totalPages,
  } = useProductData();

  const nextPage = () => setPage((prev) => prev + 1);
  const previousPage = () => setPage((prev) => prev - 1);

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 md:relative md:z-40 ${
          show ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="relative p-4">
          {/* Close button - mobile only */}
          <button
            className="absolute right-4 top-4 rounded-full bg-gray-200 p-1 dark:bg-gray-700 md:hidden"
            onClick={() => setShow(false)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>

          <h2 className="mb-4 text-lg font-bold">Bộ Lọc</h2>

          {/* Search */}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="product-search"
            >
              Tìm Theo Tên
            </label>
            <Input
              id="product-search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              type="text"
              value={search}
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="product-category"
            >
              Danh Mục
            </label>
            <select
              className="w-full rounded-md border p-2 dark:bg-gray-900 dark:text-white"
              id="product-category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">Tất Cả</option>
              {categories?.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="product-price"
            >
              Giá
            </label>
            <select
              className="w-full rounded-md border p-2 dark:bg-gray-900 dark:text-white"
              id="product-price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            >
              <option value="">Mặc Định</option>
              <option value="lowToHigh">Thấp Đến Cao</option>
              <option value="highToLow">Cao Đến Thấp</option>
            </select>
          </div>

          <Button
            className="mt-2 w-full"
            onClick={clearFilters}
            variant="outline"
          >
            Xóa Bộ Lọc
          </Button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {show && (
        <button
          aria-label="Đóng bộ lọc"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setShow(false)}
          type="button"
        />
      )}

      {/* Main content */}
      <div className="flex-1 p-4">
        {/* Mobile filter toggle */}
        <button
          className="mb-4 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white md:hidden"
          onClick={() => setShow(true)}
          type="button"
        >
          <Filter className="h-4 w-4" />
          Bộ Lọc
        </button>

        {loading ? (
          <Loading />
        ) : products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 mb-3 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {page !== 1 && (
                      <PaginationItem className="cursor-pointer">
                        <PaginationPrevious
                          onClick={previousPage}
                          text="Trước"
                        />
                      </PaginationItem>
                    )}
                    {page !== totalPages && (
                      <PaginationItem className="cursor-pointer">
                        <PaginationNext onClick={nextPage} text="Sau" />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            Không tìm thấy sản phẩm nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
