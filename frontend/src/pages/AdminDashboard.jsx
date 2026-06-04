import { BarChart3, LogOut, Menu, Package, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "@/components/admin/HomePage";
import InfoPage from "@/components/admin/InfoPage";
import OrdersPage from "@/components/admin/OrdersPage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserData } from "@/context/use-user-data";

const NAV_ITEMS = [
  { icon: Package, id: "home", label: "Sản phẩm" },
  { icon: ShoppingBag, id: "orders", label: "Đơn hàng" },
  { icon: BarChart3, id: "info", label: "Phân tích" },
];

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logoutUser } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role && user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const adminInitial = user?.email?.charAt(0).toUpperCase() || "A";

  const renderPageContent = () => {
    switch (selectedPage) {
      case "home":
        return <HomePage />;
      case "orders":
        return <OrdersPage />;
      case "info":
        return <InfoPage />;
      default:
        return <HomePage />;
    }
  };

  const handleNavClick = (id) => {
    setSelectedPage(id);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logoutUser(navigate, "/");
  };

  return (
    <div className="flex bg-background h-dvh overflow-hidden">
      {isSidebarOpen && (
        <div
          aria-hidden="true"
          className="lg:hidden z-40 fixed inset-0 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 ease-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 border-sidebar-border border-b h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex justify-center items-center bg-sidebar-primary rounded-lg size-8 font-bold text-sidebar-primary-foreground text-xs">
              QC
            </div>
            <span className="font-semibold text-sidebar-foreground text-base">
              QuickCart
            </span>
          </div>
          <Button
            aria-label="Đóng thanh bên"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            size="icon"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="mb-2 px-3 font-medium text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Quản lý
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = selectedPage === item.id;
              return (
                <button
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                  className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-out ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  type="button"
                >
                  {isActive && (
                    <span className="left-0 absolute inset-y-1.5 bg-sidebar-primary rounded-r-full w-0.5" />
                  )}
                  <Icon className="size-5 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-sidebar-border border-t">
          <button
            aria-label="Đăng xuất"
            className="flex items-center gap-3 hover:bg-sidebar-accent/50 px-3 py-2.5 rounded-xl w-full font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground text-sm transition-all duration-150 ease-out"
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="size-5 shrink-0" />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 lg:ml-64 min-h-0">
        <header className="shrink-0 flex justify-between items-center bg-background px-4 lg:px-6 border-border border-b h-16">
          <div className="flex items-center gap-3">
            <Button
              aria-label="Mở thanh bên"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              size="icon"
              variant="ghost"
            >
              <Menu className="size-5" />
            </Button>
            <h1 className="hidden lg:block font-semibold text-foreground text-lg">
              {NAV_ITEMS.find((i) => i.id === selectedPage)?.label ||
                "Tổng quan"}
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Menu người dùng"
                className="gap-2.5"
                variant="ghost"
              >
                <div className="flex justify-center items-center bg-primary rounded-full size-8 font-semibold text-primary-foreground text-xs">
                  {adminInitial}
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium text-foreground text-sm">
                    Quản trị viên
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {user?.email || ""}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-primary rounded-full size-9 font-semibold text-primary-foreground text-sm">
                    {adminInitial}
                  </div>
                  <div>
                    <div className="font-medium text-sm">Quản trị viên</div>
                    <div className="text-muted-foreground text-xs">
                      {user?.email || ""}
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-6">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
