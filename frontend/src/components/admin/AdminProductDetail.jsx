import axios from "axios";
import Cookies from "js-cookie";
import { ArrowLeft, ImagePlus, Loader, Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "@/assets/assets";
import Loading from "@/components/Loading";
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
import { useProductData } from "@/context/use-product-data";

const server = import.meta.env.VITE_SERVER_URL;

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { currency: "VND", style: "currency" }).format(
    price,
  );

const EditForm = ({ product }) => {
  const [title, setTitle] = useState(product.title || "");
  const [about, setAbout] = useState(product.about || "");
  const [stock, setStock] = useState(product.stock ?? "");
  const [price, setPrice] = useState(product.price ?? "");
  const [category, setCategory] = useState(product.category || "");
  const [btnLoading, setBtnLoading] = useState(false);
  const { fetchProduct } = useProductData();

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/api/product/${product._id}`,
        { about, category, price, stock, title },
        { headers: { token: Cookies.get("token") } },
      );
      toast.success(data.message);
      fetchProduct(product._id);
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
      setBtnLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={submitHandler}>
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

      <div className="space-y-1.5">
        <Label htmlFor="edit-about">Mô tả sản phẩm</Label>
        <textarea
          className="flex min-h-[80px] w-full rounded-4xl border border-input bg-input/30 px-3 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm resize-y"
          id="edit-about"
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Nhập mô tả sản phẩm"
          value={about}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edit-price">
            Giá (VND) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edit-price"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            required
            type="number"
            value={price}
          />
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
        </div>
      </div>

      <Separator />

      <Button
        className="w-full sm:w-auto gap-1.5"
        disabled={btnLoading}
        type="submit"
      >
        {btnLoading ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        {btnLoading ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
};

const ImageUploadForm = ({ product }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [updatedImages, setUpdatedImages] = useState(null);
  const { fetchProduct } = useProductData();

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
        `${server}/api/product/image/${product._id}`,
        formData,
        { headers: { token: Cookies.get("token") } },
      );
      toast.success(data.message);
      fetchProduct(product._id);
      setUpdatedImages(null);
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật ảnh thất bại");
      setBtnLoading(false);
    }
  };

  return (
    <form
      className="rounded-xl border bg-card p-4 space-y-3"
      onSubmit={handleSubmitImage}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <ImagePlus className="size-4" />
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
          {btnLoading ? <Loader className="size-4 animate-spin" /> : "Tải lên"}
        </Button>
      </div>
    </form>
  );
};

const AdminProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProduct, product, loading } = useProductData();

  useEffect(() => {
    fetchProduct(id);
  }, [id, fetchProduct]);

  if (loading) return <Loading />;
  if (!product)
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
        <Button onClick={() => navigate("/admin/products")} variant="outline">
          Quay lại danh sách
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => navigate("/admin/products")}
          size="icon"
          variant="ghost"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">{product.title}</h2>
          <p className="text-sm text-muted-foreground">ID: {product._id}</p>
        </div>
        <Badge
          className="ml-auto"
          variant={product.stock > 0 ? "default" : "destructive"}
        >
          {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border bg-card">
            <Carousel>
              <CarouselContent>
                {product.images?.map((image, index) => (
                  <CarouselItem key={image.url ?? `${product._id}-${index}`}>
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
                  <CarouselPrevious aria-label="Ảnh trước" className="left-2" />
                  <CarouselNext
                    aria-label="Ảnh tiếp theo"
                    className="right-2"
                  />
                </>
              )}
            </Carousel>
          </div>

          <ImageUploadForm key={product._id} product={product} />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 space-y-5">
            <h3 className="font-semibold text-lg">Thông tin sản phẩm</h3>

            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-muted-foreground">
                Tồn kho: {product.stock}
              </p>
            </div>

            <Separator />

            <EditForm key={product._id} product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;
