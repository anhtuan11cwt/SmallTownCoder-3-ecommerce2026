import { Home, Info, Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import HomePage from "@/components/admin/HomePage";
import InfoPage from "@/components/admin/InfoPage";
import OrdersPage from "@/components/admin/OrdersPage";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative h-full shadow-lg transition-transform duration-300 bg-white/50 backdrop-blur-sm z-50 w-64 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <Button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              variant="ghost"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Button
              className={`w-full justify-start ${selectedPage === "home" ? "bg-gray-200" : ""}`}
              onClick={() => setSelectedPage("home")}
              variant="ghost"
            >
              <Home className="w-4 h-4 mr-2" /> Home
            </Button>
            <Button
              className={`w-full justify-start ${selectedPage === "orders" ? "bg-gray-200" : ""}`}
              onClick={() => setSelectedPage("orders")}
              variant="ghost"
            >
              <ShoppingBag className="w-4 h-4 mr-2" /> Orders
            </Button>
            <Button
              className={`w-full justify-start ${selectedPage === "info" ? "bg-gray-200" : ""}`}
              onClick={() => setSelectedPage("info")}
              variant="ghost"
            >
              <Info className="w-4 h-4 mr-2" /> Info
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="shadow p-4 flex items-center justify-between lg:justify-end bg-white">
          <Button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="outline"
          >
            <Menu className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-bold hidden lg:block">Admin Dashboard</h2>
        </div>

        {/* Content */}
        <div className="p-4">{renderPageContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
