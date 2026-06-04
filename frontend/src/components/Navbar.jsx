import {
  ClipboardList,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const NAV_ITEMS = [
  { icon: Home, label: "Trang Chủ", path: "/" },
  { icon: Package, label: "Sản Phẩm", path: "/products" },
  { icon: ShoppingCart, label: "Giỏ Hàng", path: "/cart" },
];

const AuthMenu = ({ isAuth, user, onNavigate, onLogout }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        aria-label="Tài khoản"
        className="cursor-pointer"
        size="icon"
        variant="ghost"
      >
        {isAuth ? <User className="size-5" /> : <LogIn className="size-5" />}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="min-w-[180px]">
      <DropdownMenuLabel>
        {isAuth ? user?.fullName || user?.email || "Tài Khoản" : "Tài Khoản"}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {!isAuth ? (
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => onNavigate("/login")}
        >
          <LogIn className="mr-2 size-4" />
          Đăng Nhập
        </DropdownMenuItem>
      ) : (
        <>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onNavigate("/orders")}
          >
            <ClipboardList className="mr-2 size-4" />
            Đơn Hàng
          </DropdownMenuItem>
          {user?.role === "admin" && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onNavigate("/admin/dashboard")}
            >
              <LayoutDashboard className="mr-2 size-4" />
              Dashboard
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="mr-2 size-4" />
            Đăng Xuất
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

const Navbar = () => {
  const { isAuth, logoutUser, user } = useUserData();
  const { totalItem, setTotalItem } = useCartData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setTotalItem(0);
    const redirectTo = user?.role === "admin" ? "/admin/login" : "/login";
    logoutUser(navigate, redirectTo);
  };

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const cartLabel = `Giỏ hàng (${totalItem} sản phẩm)`;
  const badgeContent = totalItem > 99 ? "99+" : totalItem;

  return (
    <nav className="print:hidden fixed top-0 left-0 z-50 w-full border-b bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 sm:h-16 items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32">
        {/* Brand */}
        <button
          className="flex shrink-0 items-center gap-2 font-bold text-xl sm:text-2xl tracking-tight transition-[opacity,transform] duration-200 ease-out hover:opacity-80 active:scale-[0.98] motion-reduce:transition-none"
          onClick={() => navigate("/")}
          type="button"
        >
          QuickCart
        </button>

        {/* Desktop Nav */}
        <ul className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <button
                aria-current={isActive(path) ? "page" : undefined}
                className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ease-out hover:bg-accent hover:text-accent-foreground active:scale-[0.97] motion-reduce:transition-none ${
                  isActive(path)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => navigate(path)}
                type="button"
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            </li>
          ))}

          {/* Cart Badge */}
          <li className="ml-1">
            <Button
              aria-label={cartLabel}
              className="relative cursor-pointer"
              onClick={() => navigate("/cart")}
              size="icon"
              variant="ghost"
            >
              <ShoppingCart className="size-5" />
              {totalItem > 0 && (
                <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-primary px-1 py-px text-[11px] font-semibold leading-none text-primary-foreground">
                  {badgeContent}
                </span>
              )}
            </Button>
          </li>

          {/* Auth + Theme */}
          <li>
            <AuthMenu
              isAuth={isAuth}
              onLogout={handleLogout}
              onNavigate={navigate}
              user={user}
            />
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>

        {/* Mobile Actions */}
        <div className="flex sm:hidden items-center gap-0.5">
          <Button
            aria-label={cartLabel}
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
            size="icon"
            variant="ghost"
          >
            <ShoppingCart className="size-5" />
            {totalItem > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-primary px-1 py-px text-[11px] font-semibold leading-none text-primary-foreground">
                {badgeContent}
              </span>
            )}
          </Button>
          <ModeToggle />
          <Button
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
            className="cursor-pointer"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            size="icon"
            variant="ghost"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <div
        className={`overflow-hidden transition-all duration-250 ease-out motion-reduce:transition-none ${
          mobileMenuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
        id="mobile-menu"
      >
        <div className="border-t bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
              <button
                aria-current={isActive(path) ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out hover:bg-accent hover:text-accent-foreground active:scale-[0.98] motion-reduce:transition-none ${
                  isActive(path)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
                key={path}
                onClick={() => handleNav(path)}
                type="button"
              >
                <Icon className="size-5 shrink-0" />
                {label}
              </button>
            ))}
          </div>

          {/* Mobile Auth Footer */}
          <div className="border-t px-4 py-3">
            <div className="flex items-center gap-3">
              <AuthMenu
                isAuth={isAuth}
                onLogout={handleLogout}
                onNavigate={navigate}
                user={user}
              />
              <span className="text-sm font-medium text-muted-foreground">
                {isAuth ? user?.fullName || user?.email : "Tài khoản"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
