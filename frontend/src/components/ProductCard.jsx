import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/use-user-data";

const ProductCard = ({ product, latest }) => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const isAdmin = user?.role === "admin";
  const detailPath = isAdmin
    ? `/admin/products/${product._id}`
    : `/product/${product._id}`;

  if (!product) return null;

  return (
    <div className="mx-auto w-full overflow-hidden rounded-lg border border-gray-200 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700">
      <Link to={detailPath}>
        <div className="relative flex h-[250px] items-center justify-center bg-gray-100 sm:h-[300px]">
          {latest === "yes" && (
            <Badge className="absolute left-2 top-2 bg-green-500 text-white">
              Mới
            </Badge>
          )}
          <img
            alt={product.title}
            className="max-h-full max-w-full object-contain transition-transform hover:scale-105"
            src={product.images?.[0]?.url}
          />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="truncate text-lg font-semibold">
          {product.title?.slice(0, 30)}
        </h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {product.about?.slice(0, 40)}
        </p>
        <p className="mt-2 text-lg font-bold text-primary">
          {product.price?.toLocaleString("vi-VN")}đ
        </p>
      </div>

      <div className="flex items-center justify-center px-4 pb-4">
        <Button className="w-full" onClick={() => navigate(detailPath)}>
          Xem Chi Tiết
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
