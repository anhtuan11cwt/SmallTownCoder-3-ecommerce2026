import axios from "axios";
import Cookies from "js-cookie";
import { Edit, ImagePlus, Loader, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { categories } from "@/assets/assets";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCartData } from "@/context/use-cart-data";
import { useProductData } from "@/context/use-product-data";
import { useUserData } from "@/context/use-user-data";

const server = import.meta.env.VITE_SERVER_URL;

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { currency: "VND", style: "currency" }).format(
    price,
  );

const ProductPage = () => {
  const { id } = useParams();
  const { isAuth, user } = useUserData();
  const { fetchProduct, product, relatedProduct, loading } = useProductData();
  const { addToCart } = useCartData();
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [updatedImages, setUpdatedImages] = useState(null);

  useEffect(() => {
    fetchProduct(id);
  }, [id, fetchProduct]);

  const isAdmin = user && !Array.isArray(user) && user.role === "admin";

  const updateHandler = () => {
    setShow(!show);
    setCategory(product.category);
    setTitle(product.title);
    setAbout(product.about);
    setStock(product.stock);
    setPrice(product.price);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        { about, category, price, stock, title },
        { headers: { token: Cookies.get("token") } },
      );
      toast.success(data.message);
      fetchProduct(id);
      setShow(false);
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
      setBtnLoading(false);
    }
  };

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    if (!updatedImages || updatedImages.length === 0) {
      toast.error("Vui lòng chọn ảnh mới");
      setBtnLoading(false);
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < updatedImages.length; i++) {
      formData.append("files", updatedImages[i]);
    }
    try {
      const { data } = await axios.post(
        `${server}/api/product/image/${id}`,
        formData,
        { headers: { token: Cookies.get("token") } },
      );
      toast.success(data.message);
      fetchProduct(id);
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật ảnh thất bại");
      setBtnLoading(false);
    }
  };

  const addToCartHandler = () => {
    addToCart(product._id);
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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

              {/* Admin Image Upload */}
              {isAdmin && (
                <form
                  className="rounded-xl border bg-card p-4 space-y-3"
                  onSubmit={handleSubmitImage}
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ImagePlus className="w-4 h-4" />
                    <span>Cập nhật hình ảnh</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      accept="image/*"
                      aria-label="Chọn ảnh mới"
                      className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20"
                      id="files"
                      multiple
                      name="files"
                      onChange={(e) => setUpdatedImages(e.target.files)}
                      type="file"
                    />
                    <Button
                      aria-label="Tải ảnh lên"
                      disabled={btnLoading}
                      size="sm"
                      type="submit"
                    >
                      {btnLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        "Tải lên"
                      )}
                    </Button>
                  </div>
                </form>
              )}
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
              {!isAuth && !isAdmin && (
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

              {isAuth && !isAdmin && (
                <Button
                  aria-label={
                    product.stock > 0
                      ? "Thêm vào giỏ hàng"
                      : "Sản phẩm đã hết hàng"
                  }
                  className="w-full sm:w-auto min-w-[200px] h-12 text-base font-medium"
                  disabled={product.stock <= 0 || btnLoading}
                  onClick={addToCartHandler}
                >
                  {btnLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : product.stock > 0 ? (
                    "Thêm Vào Giỏ Hàng"
                  ) : (
                    "Hết Hàng"
                  )}
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

          <Separator className="my-10" />

          {/* Admin Edit Controls */}
          {isAdmin && (
            <section className="mb-10 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quản lý sản phẩm</h2>
                <Button
                  aria-label={
                    show ? "Đóng form chỉnh sửa" : "Mở form chỉnh sửa"
                  }
                  onClick={updateHandler}
                  size="sm"
                  variant="outline"
                >
                  {show ? (
                    <>
                      <X className="w-4 h-4 mr-1.5" />
                      Đóng
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-1.5" />
                      Chỉnh sửa
                    </>
                  )}
                </Button>
              </div>

              {show && (
                <div className="rounded-xl border bg-card p-6 max-w-xl space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-title">
                        Tên sản phẩm <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-title"
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nhập tên sản phẩm"
                        required
                        value={title}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-category">
                        Danh mục <span className="text-destructive">*</span>
                      </Label>
                      <select
                        className="flex h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                        id="edit-category"
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        value={category}
                      >
                        {categories.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-about">Mô tả sản phẩm</Label>
                    <Input
                      id="edit-about"
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Nhập mô tả sản phẩm"
                      value={about}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-price">
                        Giá <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-price"
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        required
                        type="number"
                        value={price}
                      />
                      <p className="text-xs text-muted-foreground">
                        Nhập giá theo VND
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-stock">
                        Tồn kho <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-stock"
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="0"
                        required
                        type="number"
                        value={stock}
                      />
                      <p className="text-xs text-muted-foreground">
                        Số lượng sản phẩm có sẵn
                      </p>
                    </div>
                  </div>

                  <Button
                    aria-label="Cập nhật thông tin sản phẩm"
                    className="w-full sm:w-auto"
                    disabled={btnLoading}
                    onClick={submitHandler}
                  >
                    {btnLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-1.5 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      "Cập nhật sản phẩm"
                    )}
                  </Button>
                </div>
              )}
            </section>
          )}

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
