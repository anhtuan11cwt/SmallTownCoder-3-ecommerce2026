import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { useCartData } from "@/context/use-cart-data";
import { useProductData } from "@/context/use-product-data";
import { useUserData } from "@/context/use-user-data";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { currency: "VND", style: "currency" }).format(
    price,
  );

const ProductPage = () => {
  const { id } = useParams();
  const { isAuth } = useUserData();
  const { fetchProduct, product, relatedProduct, loading } = useProductData();
  const { addToCart } = useCartData();

  useEffect(() => {
    fetchProduct(id);
  }, [id, fetchProduct]);

  const addToCartHandler = () => {
    addToCart(product._id);
  };

  if (loading) return <Loading />;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-6 md:py-8">
      {product && (
        <>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link
                  className="hover:text-foreground transition-colors"
                  to="/"
                >
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  className="hover:text-foreground transition-colors"
                  to="/products"
                >
                  Sản phẩm
                </Link>
              </li>
              {product.category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      className="hover:text-foreground transition-colors"
                      to={`/products?category=${encodeURIComponent(product.category)}`}
                    >
                      {product.category}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium truncate max-w-[200px]">
                {product.title}
              </li>
            </ol>
          </nav>

          {/* Product Detail Section */}
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border bg-card">
                <Carousel>
                  <CarouselContent>
                    {product.images?.map((image, index) => (
                      <CarouselItem
                        key={image.url ?? `${product._id}-${index}`}
                      >
                        <div className="flex aspect-square items-center justify-center p-4 sm:p-8">
                          <img
                            alt={product.title}
                            className="max-h-full max-w-full object-contain"
                            src={image.url}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {product.images?.length > 1 && (
                    <>
                      <CarouselPrevious
                        aria-label="Ảnh trước"
                        className="left-2"
                      />
                      <CarouselNext
                        aria-label="Ảnh tiếp theo"
                        className="right-2"
                      />
                    </>
                  )}
                </Carousel>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                  {product.title}
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {product.about}
                </p>
              </div>

              <Separator />

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-primary sm:text-4xl">
                  {formatPrice(product.price)}
                </p>
                {product.stock <= 0 && (
                  <Badge className="bg-destructive text-destructive-foreground text-xs">
                    Hết hàng
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Tình trạng:</span>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                    Còn hàng ({product.stock})
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-medium text-destructive">
                    <span className="inline-block w-2 h-2 rounded-full bg-destructive" />
                    Hết hàng
                  </span>
                )}
              </div>

              {/* Add to Cart */}
              {!isAuth && (
                <p className="flex items-center gap-2 text-sm text-blue-600">
                  <span aria-hidden="true">ℹ</span>
                  Vui lòng{" "}
                  <Link
                    className="underline font-medium hover:text-blue-700"
                    to="/login"
                  >
                    đăng nhập
                  </Link>{" "}
                  để thêm sản phẩm vào giỏ hàng
                </p>
              )}

              {isAuth && (
                <Button
                  aria-label={
                    product.stock > 0
                      ? "Thêm vào giỏ hàng"
                      : "Sản phẩm đã hết hàng"
                  }
                  className="w-full sm:w-auto min-w-[200px] h-12 text-base font-medium"
                  disabled={product.stock <= 0}
                  onClick={addToCartHandler}
                >
                  {product.stock > 0 ? "Thêm Vào Giỏ Hàng" : "Hết Hàng"}
                </Button>
              )}

              {/* Category */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Danh mục:</span>
                <Link
                  className="font-medium text-foreground hover:text-primary transition-colors"
                  to={`/products?category=${encodeURIComponent(product.category)}`}
                >
                  {product.category}
                </Link>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProduct?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-6">Sản Phẩm Liên Quan</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {relatedProduct.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;
