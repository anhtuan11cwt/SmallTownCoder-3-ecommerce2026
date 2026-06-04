import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { categories } from "@/assets/assets";
import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductContext } from "@/context/product-context";

const SERVER = import.meta.env.VITE_SERVER_URL;

const HomePage = () => {
  const { products, setPage, fetchProducts, loading, totalPages, page } =
    useContext(ProductContext);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    category: "",
    images: null,
    price: "",
    stock: "",
    title: "",
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Giải phóng object URLs khi đóng modal
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      for (const url of imagePreviews) {
        URL.revokeObjectURL(url);
      }
      setImagePreviews([]);
      setFormData({
        about: "",
        category: "",
        images: null,
        price: "",
        stock: "",
        title: "",
      });
      setIsSubmitting(false);
    }
    setOpen(isOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFormData((prev) => ({ ...prev, images: files }));

    // Giải phóng URLs cũ
    for (const url of imagePreviews) {
      URL.revokeObjectURL(url);
    }

    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.images || formData.images.length === 0) {
      toast.error("Vui lòng chọn hình ảnh");
      return;
    }

    setIsSubmitting(true);
    const myForm = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        for (let i = 0; i < value.length; i++) {
          myForm.append("files", value[i]);
        }
      } else {
        myForm.append(key, value);
      }
    });

    try {
      const { data } = await axios.post(`${SERVER}/api/product/new`, myForm, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: Cookies.get("token"),
        },
      });
      toast.success(data.message);
      handleOpenChange(false);
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Tạo sản phẩm thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previousPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl">Tất cả sản phẩm</h2>
        <Dialog onOpenChange={handleOpenChange} open={open}>
          <DialogTrigger asChild>
            <Button>Thêm sản phẩm</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm sản phẩm mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết của sản phẩm để thêm vào cửa hàng.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                disabled={isSubmitting}
                name="title"
                onChange={handleChange}
                placeholder="Tên sản phẩm"
                required
                value={formData.title}
              />
              <Input
                disabled={isSubmitting}
                name="about"
                onChange={handleChange}
                placeholder="Mô tả sản phẩm"
                required
                value={formData.about}
              />
              <select
                className="bg-input/30 px-3 py-1 border border-input rounded-4xl outline-none w-full h-9 text-sm"
                disabled={isSubmitting}
                name="category"
                onChange={handleChange}
                required
                value={formData.category}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Input
                disabled={isSubmitting}
                name="price"
                onChange={handleChange}
                placeholder="Giá"
                required
                type="number"
                value={formData.price}
              />
              <Input
                disabled={isSubmitting}
                name="stock"
                onChange={handleChange}
                placeholder="Tồn kho"
                required
                type="number"
                value={formData.stock}
              />
              <Input
                accept="image/*"
                disabled={isSubmitting}
                multiple
                name="images"
                onChange={handleFileChange}
                required
                type="file"
              />
              {/* Phần xem trước hình ảnh */}
              {imagePreviews.length > 0 && (
                <div className="gap-2 grid grid-cols-3 mt-2">
                  {imagePreviews.map((preview) => (
                    <img
                      alt="Xem trước"
                      className="border rounded-md w-full h-24 object-cover"
                      key={preview}
                      src={preview}
                    />
                  ))}
                </div>
              )}
              <Button className="w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} latest={false} product={product} />
          ))
        ) : (
          <p>Không tìm thấy sản phẩm.</p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={page === 1}
                onClick={previousPage}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm">
                Trang {page} / {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                disabled={page === totalPages}
                onClick={nextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default HomePage;
