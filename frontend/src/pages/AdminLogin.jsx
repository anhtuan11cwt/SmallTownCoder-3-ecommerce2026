import { Eye, EyeOff, Loader, Shield } from "lucide-react";
import { useState } from "react";
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
import { useUserData } from "@/context/use-user-data";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("adminpassword123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginAdmin, btnLoading } = useUserData();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginAdmin(email, password, navigate);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center bg-background px-4 min-h-screen">
      <Card className="w-full sm:w-[380px]">
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <CardHeader className="items-center text-center">
            <div className="flex justify-center items-center bg-primary/10 mb-2 rounded-2xl size-12">
              <Shield className="size-6 text-primary" />
            </div>
            <CardTitle>Admin Đăng Nhập</CardTitle>
            <CardDescription>
              Vui lòng đăng nhập với tài khoản quản trị
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  aria-label="Email"
                  autoComplete="email"
                  disabled={btnLoading}
                  id="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="admin@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    aria-label="Mật khẩu"
                    autoComplete="current-password"
                    className="pr-10"
                    disabled={btnLoading}
                    id="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="top-1/2 right-3 absolute text-muted-foreground hover:text-foreground -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <p
                  aria-live="polite"
                  className="text-destructive text-xs"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={btnLoading} type="submit">
              {btnLoading ? <Loader className="animate-spin" /> : "Đăng nhập"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
