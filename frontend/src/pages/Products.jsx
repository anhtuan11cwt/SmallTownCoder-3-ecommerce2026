import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams, setCategory]);

  const handleClearFilters = () => {
    clearFilters();
    navigate("/products", { replace: true });
  };

  return (
    <div className="flex md:flex-row flex-col min-h-[calc(100vh-64px)]">
      {/* Sidebar wrapper — handles alignment padding on desktop */}
      <div className="md:pl-6 lg:pl-24 xl:pl-32 md:shrink-0">
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out bg-background md:bg-transparent md:relative md:z-auto md:w-64 ${
            show ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="relative px-6 md:px-0 py-6">
            {/* Close button - mobile only */}
            <button
              className="md:hidden top-4 right-4 absolute bg-muted p-1 rounded-full"
              onClick={() => setShow(false)}
              type="button"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="mb-4 font-bold text-lg">Bộ Lọc</h2>

            {/* Search */}
            <div className="mb-4">
              <label
                className="block mb-2 font-medium text-sm"
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
                className="block mb-2 font-medium text-sm"
                htmlFor="product-category"
              >
                Danh Mục
              </label>
              <select
                className="bg-background p-2 border border-input rounded-md w-full text-foreground"
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
                className="block mb-2 font-medium text-sm"
                htmlFor="product-price"
              >
                Giá
              </label>
              <select
                className="bg-background p-2 border border-input rounded-md w-full text-foreground"
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
              onClick={handleClearFilters}
              variant="outline"
            >
              Xóa Bộ Lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {show && (
        <button
          aria-label="Đóng bộ lọc"
          className="md:hidden z-40 fixed inset-0 bg-background/80"
          onClick={() => setShow(false)}
          type="button"
        />
      )}

      {/* Main content */}
      <div className="flex-1 px-6 md:px-16 lg:px-24 xl:px-32 py-6 md:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-foreground transition-colors" to="/">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li
              className={
                category
                  ? "hover:text-foreground transition-colors"
                  : "text-foreground font-medium"
              }
            >
              {category ? (
                <Link
                  className="hover:text-foreground transition-colors"
                  to="/products"
                >
                  Sản phẩm
                </Link>
              ) : (
                "Sản phẩm"
              )}
            </li>
            {category && (
              <>
                <li aria-hidden="true">/</li>
                <li className="text-foreground font-medium truncate max-w-[200px]">
                  {category}
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Mobile filter toggle */}
        <button
          className="md:hidden flex items-center gap-2 bg-primary mb-6 px-4 py-2 rounded-md text-white"
          onClick={() => setShow(true)}
          type="button"
        >
          <Filter className="w-4 h-4" />
          Bộ Lọc
        </button>

        {loading ? (
          <Loading />
        ) : products && products.length > 0 ? (
          <>
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 mb-3">
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
          <p className="text-muted-foreground text-center">
            Không tìm thấy sản phẩm nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
