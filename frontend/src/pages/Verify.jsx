import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartData } from "@/context/use-cart-data";
import { useUserData } from "@/context/use-user-data";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(90);
  const { btnLoading, verifyUser, loginUser } = useUserData();
  const { fetchCart } = useCartData();
  const navigate = useNavigate();
  const canResend = timer === 0;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await verifyUser(Number(otp), navigate);
    fetchCart();
  };

  const handleResend = async () => {
    const email = localStorage.getItem("email");
    if (email) {
      await loginUser(email, navigate);
      setTimer(90);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full sm:w-[300px] md:w-[400px]">
        <form className="flex flex-col gap-6" onSubmit={submitHandler}>
          <CardHeader>
            <CardTitle>Xác Minh OTP</CardTitle>
            <CardDescription>
              Nhập mã OTP đã được gửi đến email của bạn. Nếu không thấy trong
              hộp thư, hãy kiểm tra thư mục Spam.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="otp">Nhập Mã OTP</Label>
              <Input
                id="otp"
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập mã OTP"
                required
                type="number"
                value={otp}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full" disabled={btnLoading} type="submit">
              {btnLoading ? <Loader className="animate-spin" /> : "Xác Minh"}
            </Button>
          </CardFooter>
        </form>

        <div className="flex flex-col items-center justify-center px-6 pb-4">
          <p className="mb-2 text-sm text-muted-foreground">
            {canResend
              ? "Bạn có thể gửi lại mã OTP"
              : `Thời gian còn lại: ${formatTime(timer)}`}
          </p>
          <Button
            disabled={!canResend}
            onClick={handleResend}
            size="sm"
            variant="outline"
          >
            Gửi Lại OTP
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Verify;
