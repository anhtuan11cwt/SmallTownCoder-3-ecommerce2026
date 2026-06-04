import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import Loading from "@/components/Loading";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SERVER = import.meta.env.VITE_SERVER_URL;

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const statusLabels = {
  delivered: "Đã giao",
  pending: "Chờ xử lý",
  shipped: "Đang giao",
};

const statusColors = {
  delivered: "bg-green-500",
  pending: "bg-yellow-500",
  shipped: "bg-blue-500",
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(`${SERVER}/api/order/all/admin`, {
        headers: { token },
      });
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await fetchOrders();
      if (cancelled) return;
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [fetchOrders]);

  const filteredOrders = orders.filter(
    (order) =>
      order.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      order._id?.toLowerCase().includes(search.toLowerCase()),
  );

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${SERVER}/api/order/status/${orderId}`,
        { status },
        { headers: { token } },
      );
      toast.success(data.message);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 p-4">
      <h1 className="font-bold text-2xl">Quản lý đơn hàng</h1>

      <Input
        className="w-full md:w-1/2"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm theo Email hoặc Mã đơn"
        value={search}
      />

      {filteredOrders.length > 0 ? (
        <>
          {/* Desktop: Table */}
          <div className="hidden md:block border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      <Link
                        className="text-primary hover:underline"
                        to={`/order/${order._id}`}
                      >
                        {order._id.slice(-8).toUpperCase()}
                      </Link>
                    </TableCell>
                    <TableCell>{order.user?.email || "N/A"}</TableCell>
                    <TableCell>
                      {order.subTotal?.toLocaleString("vi-VN")}₫
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-white text-xs font-semibold ${
                          statusColors[order.status] || "bg-gray-500"
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <select
                        className="bg-background px-2 py-1 border border-border rounded-md text-sm"
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        value={order.status}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="shipped">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile: Cards */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((order) => (
              <div className="space-y-3 p-4 border rounded-lg" key={order._id}>
                <div className="flex justify-between items-center">
                  <Link
                    className="font-medium text-primary text-sm hover:underline"
                    to={`/order/${order._id}`}
                  >
                    #{order._id.slice(-8).toUpperCase()}
                  </Link>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      statusColors[order.status] || "bg-gray-500"
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm truncate">
                  {order.user?.email || "N/A"}
                </p>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">
                    {order.subTotal?.toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <select
                  className="bg-background px-3 py-2 border border-border rounded-md w-full min-h-[44px] text-sm"
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  value={order.status}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="shipped">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                </select>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">Không có đơn hàng</p>
      )}
    </div>
  );
};

export default OrdersPage;
