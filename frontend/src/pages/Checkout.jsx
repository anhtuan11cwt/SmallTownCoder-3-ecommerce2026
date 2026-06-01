import axios from "axios";
import Cookies from "js-cookie";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const SERVER = import.meta.env.VITE_SERVER_URL;

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    phoneNumber: "",
  });

  const getToken = useCallback(
    () => Cookies.get("token") || localStorage.getItem("token"),
    [],
  );

  const fetchAddresses = useCallback(async () => {
    try {
      const { data } = await axios.get(`${SERVER}/api/address/all`, {
        headers: { token: getToken() },
      });
      setAddresses(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    let ignore = false;

    const loadAddresses = async () => {
      try {
        const { data } = await axios.get(`${SERVER}/api/address/all`, {
          headers: { token: getToken() },
        });

        if (ignore) return;

        setAddresses(data);
      } catch (error) {
        console.log(error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadAddresses();

    return () => {
      ignore = true;
    };
  }, [getToken]);

  async function handleAddAddress() {
    try {
      const { data } = await axios.post(
        `${SERVER}/api/address/new`,
        {
          address: newAddress.address,
          phoneNumber: Number(newAddress.phoneNumber),
        },
        { headers: { token: getToken() } },
      );
      toast.success(data.message);
      fetchAddresses();
      setNewAddress({ address: "", phoneNumber: "" });
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
    }
  }

  async function handleDeleteAddress(id) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      const { data } = await axios.delete(`${SERVER}/api/address/${id}`, {
        headers: { token: getToken() },
      });
      toast.success(data.message);
      fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Thanh Toán</h1>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Địa Chỉ Giao Hàng</h2>
        <Button onClick={() => setModalOpen(true)} variant="outline">
          + Thêm Địa Chỉ Mới
        </Button>
      </div>

      {addresses.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">
          Chưa có địa chỉ nào
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((item) => (
            <div
              className="flex flex-col justify-between rounded-lg border p-4 shadow-sm"
              key={item._id}
            >
              <div>
                <h3 className="flex items-start justify-between gap-2 text-lg font-semibold">
                  <span>{item.address}</span>
                  <Button
                    onClick={() => handleDeleteAddress(item._id)}
                    size="icon"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  SĐT: {item.phoneNumber}
                </p>
              </div>
              <Link className="mt-4" to={`/payment/${item._id}`}>
                <Button className="w-full" variant="outline">
                  Sử Dụng Địa Chỉ Này
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Dialog */}
      <Dialog onOpenChange={setModalOpen} open={modalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Địa Chỉ Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              onChange={(e) =>
                setNewAddress({ ...newAddress, address: e.target.value })
              }
              placeholder="Địa chỉ"
              value={newAddress.address}
            />
            <Input
              onChange={(e) =>
                setNewAddress({ ...newAddress, phoneNumber: e.target.value })
              }
              placeholder="Số điện thoại"
              type="number"
              value={newAddress.phoneNumber}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setModalOpen(false)} variant="outline">
              Đóng
            </Button>
            <Button onClick={handleAddAddress}>Thêm Địa Chỉ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
