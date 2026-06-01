import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCartData } from "@/context/use-cart-data";
import { useProductData } from "@/context/use-product-data";
import { useUserData } from "@/context/use-user-data";

const ProductPage = () => {
  const { id } = useParams();
  const { isAuth } = useUserData();
  const { fetchProduct, product, relatedProduct, loading } = useProductData();
  const { addToCart } = useCartData();

  useEffect(() => {
    fetchProduct(id);
  }, [id, fetchProduct]);

  if (loading) return <Loading />;

  const addToCartHandler = () => {
    addToCart(product._id);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {product && (
        <>
          <div className="mt-4 flex flex-col gap-16 md:flex-row">
            {/* Carousel */}
            <div className="w-[290px] md:w-[650px]">
              <Carousel>
                <CarouselContent>
                  {product.images?.map((image, index) => (
                    <CarouselItem key={image.url ?? `${product._id}-${index}`}>
                      <img
                        alt={`Ảnh sản phẩm ${index + 1}`}
                        className="w-full rounded-md"
                        src={image.url}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* Product Info */}
            <div className="w-full text-sm md:w-1/2">
              <h2 className="text-3xl font-medium">{product.title}</h2>
              <p className="mt-4 text-base text-muted-foreground">
                {product.about}
              </p>

              <div className="mt-6">
                <p className="text-2xl font-medium">
                  {product.price?.toLocaleString("vi-VN")}đ
                </p>
              </div>

              <div className="mt-10 flex items-center gap-4 text-base">
                {!isAuth ? (
                  <p className="text-blue-500">
                    Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng
                  </p>
                ) : product.stock <= 0 ? (
                  <p className="text-2xl text-red-600">Hết Hàng</p>
                ) : (
                  <Button
                    className="w-full py-3.5 font-medium"
                    onClick={addToCartHandler}
                  >
                    Thêm Vào Giỏ Hàng
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProduct?.length > 0 && (
            <div className="mt-14">
              <h3 className="text-xl font-bold">Sản Phẩm Liên Quan</h3>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {relatedProduct.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;
