import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${server}/api/order/${id}`, {
          headers: {
            token: token,
          },
        });
        setOrder(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Loading />;

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] text-center">
        <h1 className="mb-4 font-bold text-red-600 text-2xl">
          Không tìm thấy đơn hàng với ID này
        </h1>
        <Button onClick={() => navigate("/products")}>Mua sắm ngay</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="font-bold text-2xl">
            Chi tiết đơn hàng
          </CardTitle>
          <Button onClick={() => window.print()}>In đơn hàng</Button>
        </CardHeader>
        <CardContent>
          <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 font-semibold text-xl">Tóm tắt đơn hàng</h3>
              <p>
                <strong>Mã đơn hàng:</strong> {order._id.toUpperCase()}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {statusMap[order.status] || order.status}
              </p>
              <p>
                <strong>Tổng số mặt hàng:</strong> {order.items.length}
              </p>
              <p>
                <strong>Phương thức thanh toán:</strong> {order.method}
              </p>
              <p>
                <strong>Tạm tính:</strong> {formatPrice(order.subTotal)}
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-xl">Chi tiết giao hàng</h3>
              <p>
                <strong>Số điện thoại:</strong> {order.phoneNumber}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {order.address}
              </p>
              <p>
                <strong>Người dùng:</strong>{" "}
                {order.user ? order.user.email : "Khách"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {order.items.map((item) => (
          <Card key={item.product._id}>
            <Link to={`/product/${item.product._id}`}>
              <img
                alt={item.product.title}
                className="w-full h-48 object-contain"
                src={item.product.images[0]?.url}
              />
            </Link>
            <CardContent className="mt-4">
              <h3 className="font-semibold text-lg">{item.product.title}</h3>
              <p>
                <strong>Số lượng:</strong> {item.quantity}
              </p>
              <p>
                <strong>Giá:</strong> {formatPrice(item.product.price)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
