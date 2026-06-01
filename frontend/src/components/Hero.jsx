import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex min-h-[calc(100vh-64px)] items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/bg-image.jpg')",
      }}
    >
      <div className="px-4 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
          Chào Mừng Đến Với Cửa Hàng
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-lg sm:text-xl md:text-2xl">
          Khám phá những sản phẩm tuyệt vời và ưu đãi hấp dẫn dành cho bạn
        </p>
        <Button onClick={() => navigate("/products")} size="lg">
          Mua Sắm Ngay
        </Button>
      </div>
    </div>
  );
};

export default Hero;
