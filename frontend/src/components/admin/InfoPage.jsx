import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SERVER = import.meta.env.VITE_SERVER_URL;

const COLORS = {
  cod: "#8c1a25",
  online: "#03bafc",
};

/** Donut chart with an HTML overlay for the center label */
const DonutChart = ({ chartData, centerLabel }) => (
  <div className="flex justify-center w-full">
    <div className="relative w-full max-w-[280px] aspect-square">
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Tooltip cursor={false} />
          <Pie
            cx="50%"
            cy="50%"
            data={chartData}
            dataKey="users"
            innerRadius="30%"
            nameKey="method"
            outerRadius="45%"
            strokeWidth={4}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label — positioned over the hole of the donut */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
        {centerLabel}
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-popover shadow-sm px-3 py-2 border border-border rounded text-popover-foreground text-sm">
        <strong>{item.name}</strong>
        <br />
        <span>Sold: {item.sold}</span>
      </div>
    );
  }
  return null;
};

const BarChartSection = ({ data }) => (
  <div className="pb-2 w-full overflow-x-auto">
    <div className="h-[250px] sm:h-[350px] md:h-[400px]">
      <ResponsiveContainer
        height="100%"
        minHeight={0}
        minWidth={0}
        width="100%"
      >
        <BarChart
          data={data}
          margin={{ bottom: 5, left: 0, right: 15, top: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            axisLine={false}
            dataKey="name"
            tick={false}
            tickLine={false}
            tickMargin={0}
          />
          <YAxis width={35} />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="sold" fill="#8884d8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const InfoPage = () => {
  const [cod, setCod] = useState(0);
  const [online, setOnline] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const token = Cookies.get("token");
        const { data: stats } = await axios.get(`${SERVER}/api/order/stats`, {
          headers: { token },
        });
        if (!cancelled) {
          setCod(stats.codOrder);
          setOnline(stats.onlineOrder);
          setData(stats.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = cod + online;

  const paymentData = [
    { fill: COLORS.online, method: "Online", users: online },
    { fill: COLORS.cod, method: "COD", users: cod },
  ];

  const paymentPercentage = paymentData.map((item) => ({
    ...item,
    users: Number.parseFloat(((item.users / (total || 1)) * 100).toFixed(2)),
  }));

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Pie Charts — side by side on sm+, stacked on mobile */}
      <div className="flex sm:flex-row flex-col gap-4">
        {/* Pie Chart - Payment Methods Count */}
        <Card className="flex-1 min-w-0">
          <CardHeader>
            <CardTitle>Biểu đồ phương thức thanh toán</CardTitle>
            <CardDescription>Phân bổ đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              centerLabel={
                <>
                  <span className="font-bold text-2xl leading-none">
                    {total}
                  </span>
                  <span className="mt-1 text-muted-foreground text-xs">
                    Đơn hàng
                  </span>
                </>
              }
              chartData={paymentData}
            />
          </CardContent>
          <CardFooter className="text-muted-foreground text-xs sm:text-sm break-words">
            Tổng số đơn hàng theo phương thức thanh toán
          </CardFooter>
        </Card>

        {/* Pie Chart - Payment Percentage */}
        <Card className="flex-1 min-w-0">
          <CardHeader>
            <CardTitle>Tỷ lệ thanh toán</CardTitle>
            <CardDescription>Phân bổ phần trăm</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              centerLabel={<span className="font-bold text-2xl">100%</span>}
              chartData={paymentPercentage}
            />
          </CardContent>
          <CardFooter className="text-muted-foreground text-xs sm:text-sm break-words">
            Hiển thị tỷ lệ phần trăm phương thức thanh toán
          </CardFooter>
        </Card>
      </div>

      {/* Bar Chart - Products Sold */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="break-words">Biểu đồ sản phẩm đã bán</CardTitle>
          <CardDescription className="break-words">
            Số lượng bán cho từng sản phẩm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChartSection data={data} />
        </CardContent>
        <CardFooter className="text-muted-foreground text-xs sm:text-sm break-words">
          {data.length > 6
            ? "← Kéo sang để xem thêm sản phẩm →"
            : "Số lượng bán cho từng sản phẩm"}
        </CardFooter>
      </Card>
    </div>
  );
};

export default InfoPage;
