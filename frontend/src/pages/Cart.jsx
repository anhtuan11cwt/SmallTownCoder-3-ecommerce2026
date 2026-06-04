import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartData } from "@/context/use-cart-data";

const Cart = () => {
  const { cart, totalItem, subTotal, updateCart, removeFromCart } =
    useCartData();
  const navigate = useNavigate();

  const updateCartHandler = (action, id) => {
    updateCart(action, id);
  };

  if (!cart) return <Loading />;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-6 md:py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Giỏ Hàng</h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
          <p className="mb-6 text-lg text-muted-foreground">Giỏ hàng trống</p>
          <Button onClick={() => navigate("/products")}>Mua Sắm Ngay</Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <div
                className="flex flex-col items-center gap-4 rounded-lg border p-4 shadow-sm sm:flex-row sm:items-stretch"
                key={item._id}
              >
                <img
                  alt={item.product.title}
                  className="h-20 w-20 cursor-pointer rounded-md object-cover"
                  onClick={() => navigate(`/product/${item.product._id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/product/${item.product._id}`);
                    }
                  }}
                  src={item.product.images?.[0]?.url}
                />

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-medium">{item.product.title}</h2>
                  <p className="text-muted-foreground">
                    {item.product.price?.toLocaleString("vi-VN")}đ
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => updateCartHandler("dec", item._id)}
                    size="icon"
                    variant="outline"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    onClick={() => updateCartHandler("inc", item._id)}
                    size="icon"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => removeFromCart(item._id)}
                    size="icon"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="rounded-lg border p-6 shadow-lg">
            <h2 className="mb-4 text-center text-xl font-semibold lg:text-left">
              Tóm Tắt Đơn Hàng
            </h2>
            <Separator className="my-2" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tổng số lượng</span>
                <span>{totalItem}</span>
              </div>
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{subTotal?.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-medium">
              <span>Tổng cộng</span>
              <span>{subTotal?.toLocaleString("vi-VN")}đ</span>
            </div>
            <Button
              className="mt-6 w-full"
              disabled={cart.length === 0}
              onClick={() => navigate("/checkout")}
            >
              Thanh Toán
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
