import { Navigate, useLocation } from "react-router-dom";
import Loading from "@/components/Loading";
import { useUserData } from "@/context/use-user-data";

export const ProtectedRoute = ({
  children,
  role,
  requireAuth = true,
  publicOnly = false,
}) => {
  const { isAuth, loading, user } = useUserData();
  const { pathname } = useLocation();

  if (loading) return <Loading />;

  // Nếu chỉ dành cho người chưa đăng nhập (ví dụ: trang login, verify)
  if (publicOnly) {
    if (isAuth) {
      if (user?.role === "admin") return <Navigate to="/admin/dashboard" />;
      return <Navigate to="/" />;
    }
    return children;
  }

  // Nếu yêu cầu đăng nhập
  if (requireAuth && !isAuth) {
    return <Navigate to="/login" />;
  }

  // Chặn admin truy cập các trang không phải /admin/*
  if (isAuth && user?.role === "admin" && !pathname.startsWith("/admin/")) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Nếu yêu cầu role cụ thể
  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};
