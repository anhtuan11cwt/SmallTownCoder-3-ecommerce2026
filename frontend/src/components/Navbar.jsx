import { LogIn, Menu, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartData } from "@/context/use-cart-data";
import { useUserData } from "@/context/use-user-data";

const Navbar = () => {
  const { isAuth, logoutUser, user } = useUserData();
  const { totalItem, setTotalItem } = useCartData();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setTotalItem(0);
    const redirectTo = user?.role === "admin" ? "/admin/login" : "/login";
    logoutUser(navigate, redirectTo);
  };

  const navItems = [
    { label: "Trang Chủ", path: "/" },
    { label: "Sản Phẩm", path: "/products" },
    { label: "Giỏ Hàng", path: "/cart" },
  ];

  return (
    <nav className="print:hidden fixed top-0 left-0 z-50 bg-background/50 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
      <div className="flex justify-between items-center mx-auto px-4 py-3 container">
        {/* Brand */}
        <button
          className="font-bold text-2xl"
          onClick={() => navigate("/")}
          type="button"
        >
          QuickCart
        </button>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex items-center space-x-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                className="font-medium hover:text-primary text-sm transition-colors"
                onClick={() => navigate(item.path)}
                type="button"
              >
                {item.label}
              </button>
            </li>
          ))}

          {/* Cart Badge */}
          <li>
            <button
              aria-label="Xem giỏ hàng"
              className="relative flex items-center"
              onClick={() => navigate("/cart")}
              type="button"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 rounded-full w-5 h-5 font-bold text-white text-xs">
                {totalItem}
              </span>
            </button>
          </li>

          {/* Auth Dropdown */}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="cursor-pointer" size="icon" variant="ghost">
                  {isAuth ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tài Khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isAuth ? (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Đăng Nhập
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/orders")}
                    >
                      Đơn Hàng
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/admin/dashboard")}
                      >
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={handleLogout}
                    >
                      Đăng Xuất
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>

          {/* Mode Toggle */}
          <li>
            <ModeToggle />
          </li>
        </ul>

        {/* Mobile: Cart + Auth + Toggle + Hamburger */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            aria-label="View cart"
            className="relative flex items-center"
            onClick={() => navigate("/cart")}
            type="button"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="-top-2 -right-2 absolute flex justify-center items-center bg-red-500 rounded-full w-4 h-4 font-bold text-[10px] text-white">
              {totalItem}
            </span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer" size="icon" variant="ghost">
                {isAuth ? (
                  <User className="w-5 h-5" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài Khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!isAuth ? (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Đăng Nhập
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/orders")}
                  >
                    Đơn Hàng
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    Đăng Xuất
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />

          <Button
            className="cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            size="icon"
            variant="ghost"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-background/95 backdrop-blur border-t">
          <ul className="flex flex-col space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  className="hover:bg-accent px-3 py-2 rounded-md w-full font-medium text-sm text-left transition-colors hover:text-accent-foreground"
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
