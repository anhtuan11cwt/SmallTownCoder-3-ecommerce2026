import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="mx-auto flex w-[60%] flex-col items-center justify-center py-20">
      <img
        alt="Không tìm thấy trang"
        className="max-w-[400px]"
        src="/not found.png"
      />
      <h1 className="mt-6 text-3xl font-bold">Không Tìm Thấy Trang</h1>
      <p className="mt-2 text-muted-foreground">
        Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link className="mt-6" to="/">
        <Button variant="ghost">
          <Home className="mr-2 h-4 w-4" />
          Về Trang Chủ
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
