import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusMap = {
  cancelled: "Đã hủy",
  delivered: "Đã giao hàng",
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang vận chuyển",
};

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { currency: "VND", style: "currency" }).format(
    price,
  );

const server = import.meta.env.VITE_SERVER_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${server}/api/order/all`, {
          headers: {
            token: token,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] text-center">
        <h1 className="mb-4 font-bold text-gray-600 text-2xl">
          Chưa có đơn hàng
        </h1>
        <Button onClick={() => navigate("/products")}>Mua sắm ngay</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      <h1 className="mb-6 font-bold text-3xl text-center">Đơn hàng của bạn</h1>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card
            className="hover:shadow-lg transition-shadow duration-200"
            key={order._id}
          >
            <CardHeader>
              <CardTitle className="text-lg">
                Đơn hàng #{order._id.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={
                    order.status === "delivered"
                      ? "text-green-500"
                      : order.status === "cancelled"
                        ? "text-red-500"
                        : "text-yellow-500"
                  }
                >
                  {statusMap[order.status] || order.status}
                </span>
              </p>
              <p>
                <strong>Tổng số mặt hàng:</strong> {order.items.length}
              </p>
              <p>
                <strong>Tạm tính:</strong> {formatPrice(order.subTotal)}
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <Button
                className="mt-4 w-full"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                Xem chi tiết
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
