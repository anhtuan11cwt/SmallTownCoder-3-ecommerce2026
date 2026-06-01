import { Loader, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useUserData } from "@/context/use-user-data";

const Login = () => {
  const [email, setEmail] = useState("");
  const { loginUser, btnLoading } = useUserData();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, navigate);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full sm:w-[300px] md:w-[400px]">
        <form className="flex flex-col gap-6" onSubmit={submitHandler}>
          <CardHeader>
            <CardTitle>Đăng Nhập</CardTitle>
            <CardDescription>
              Nhập email để nhận mã OTP. Nếu bạn đã có mã OTP,{" "}
              <Link
                className={`underline ${btnLoading ? "text-muted-foreground pointer-events-none" : "text-primary"}`}
                to="/verify"
              >
                nhấn vào đây
              </Link>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="email">Nhập Email</Label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 size-4 -translate-y-1/2 ${btnLoading ? "text-muted-foreground/50" : "text-muted-foreground"}`}
                />
                <Input
                  className="pl-10"
                  disabled={btnLoading}
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={btnLoading} type="submit">
              {btnLoading ? <Loader className="animate-spin" /> : "Gửi Mã OTP"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
