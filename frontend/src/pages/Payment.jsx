import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartData } from "@/context/use-cart-data";

const SERVER = import.meta.env.VITE_SERVER_URL;

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, subTotal, fetchCart } = useCartData();

  const [address, setAddress] = useState(null);
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = useCallback(
    () => Cookies.get("token") || localStorage.getItem("token"),
    [],
  );

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const { data } = await axios.get(`${SERVER}/api/address/${id}`, {
          headers: { token: getToken() },
        });
        setAddress(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddress();
  }, [id, getToken]);

  const paymentHandler = async () => {
    setLoading(true);
    try {
      const token = getToken();

      if (method === "COD") {
        const { data } = await axios.post(
          `${SERVER}/api/order/new/cod`,
          {
            address: address.address,
            method,
            phoneNumber: address.phoneNumber,
          },
          { headers: { token } },
        );
        toast.success(data.message);
        fetchCart();
        navigate("/orders");
      } else if (method === "Online") {
        const { data } = await axios.post(
          `${SERVER}/api/order/new/online`,
          {
            address: address.address,
            method,
            phoneNumber: address.phoneNumber,
          },
          { headers: { token } },
        );
        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error("Không thể tạo phiên thanh toán");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return <Loading />;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Thanh Toán</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold">Sản Phẩm</h2>
          <Separator />
          {cart.map((item) => (
            <div
              className="flex items-center gap-4 rounded-lg border p-4 shadow-sm"
              key={item._id}
            >
              <img
                alt={item.product.title}
                className="h-16 w-16 rounded-md object-cover"
                src={item.product.images?.[0]?.url}
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.product.price?.toLocaleString("vi-VN")}đ x{" "}
                  {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                {(item.product.price * item.quantity)?.toLocaleString("vi-VN")}đ
              </p>
            </div>
          ))}

          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Tổng tiền</span>
            <span>{subTotal?.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-6">
          {/* Delivery Address */}
          {address && (
            <div className="rounded-lg border p-4 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold">Địa Chỉ Giao Hàng</h2>
              <Separator className="mb-2" />
              <p>{address.address}</p>
              <p className="text-sm text-muted-foreground">
                SĐT: {address.phoneNumber}
              </p>
            </div>
          )}

          {/* Payment Method */}
          <div className="rounded-lg border p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">
              Phương Thức Thanh Toán
            </h2>
            <Separator className="mb-2" />
            <select
              className="w-full rounded-lg border bg-background p-2"
              onChange={(e) => setMethod(e.target.value)}
              value={method}
            >
              <option value="">Chọn phương thức</option>
              <option value="COD">Thanh toán khi nhận hàng (COD)</option>
              <option value="Online">Thanh toán Online</option>
            </select>
          </div>

          <Button
            className="w-full py-3"
            disabled={!method || !address || loading}
            onClick={paymentHandler}
          >
            {loading ? "Đang xử lý..." : "Tiến Hành Thanh Toán"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
