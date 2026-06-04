import axios from "axios";
import Cookies from "js-cookie";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCartData } from "@/context/use-cart-data";

const SERVER = import.meta.env.VITE_SERVER_URL;

const OrderProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCart } = useCartData();
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error("Thiếu mã phiên thanh toán");
        navigate("/cart");
        return;
      }

      if (paymentVerified) return;

      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const { data } = await axios.post(
          `${SERVER}/api/order/verify/payment?session_id=${sessionId}`,
          {},
          { headers: { token } },
        );

        if (data.success) {
          toast.success("Đặt hàng thành công");
          setPaymentVerified(true);
          fetchCart();
          setLoading(false);
          setTimeout(() => navigate("/orders"), 10000);
        }
      } catch (error) {
        toast.error("Xác minh thanh toán thất bại");
        console.log(error);
        navigate("/cart");
      }
    };

    verifyPayment();
  }, [sessionId, paymentVerified, navigate, fetchCart]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-blue-500 dark:from-blue-950 dark:to-blue-800">
      <div className="mx-4 max-w-lg rounded-xl bg-white p-8 text-center shadow-lg dark:bg-card">
        {loading ? (
          <>
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
            <h2 className="mb-2 text-2xl font-extrabold text-blue-600">
              Đang Xử Lý Đơn Hàng
            </h2>
            <p className="text-muted-foreground">
              Vui lòng chờ trong khi chúng tôi xác minh thanh toán của bạn
            </p>
          </>
        ) : (
          <>
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h2 className="mb-2 text-2xl font-extrabold text-green-500">
              Đặt Hàng Thành Công
            </h2>
            <p className="mb-6 text-muted-foreground">
              Cảm ơn bạn đã mua sắm. Đơn hàng sẽ được giao sớm.
            </p>
            <Button onClick={() => navigate("/orders")}>Xem Đơn Hàng</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderProcessing;
