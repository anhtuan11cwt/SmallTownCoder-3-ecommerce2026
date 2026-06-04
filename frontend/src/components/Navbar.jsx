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
    logoutUser(navigate);
  };

  const navItems = [
    { label: "Trang Chủ", path: "/" },
    { label: "Sản Phẩm", path: "/products" },
    { label: "Giỏ Hàng", path: "/cart" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Brand */}
        <button
          className="text-2xl font-bold"
          onClick={() => navigate("/")}
          type="button"
        >
          QuickCart
        </button>

        {/* Desktop Menu */}
        <ul className="hidden items-center space-x-6 sm:flex">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                className="text-sm font-medium transition-colors hover:text-primary"
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
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
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
                    <User className="h-5 w-5" />
                  ) : (
                    <LogIn className="h-5 w-5" />
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
        <div className="flex items-center gap-2 sm:hidden">
          <button
            aria-label="View cart"
            className="relative flex items-center"
            onClick={() => navigate("/cart")}
            type="button"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {totalItem}
            </span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer" size="icon" variant="ghost">
                {isAuth ? (
                  <User className="h-5 w-5" />
                ) : (
                  <LogIn className="h-5 w-5" />
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
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-background/95 backdrop-blur sm:hidden">
          <ul className="flex flex-col space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  className="w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
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
