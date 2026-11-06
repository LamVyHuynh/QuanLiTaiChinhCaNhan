import { PieChart, Sparkles } from "lucide-react";

// Màu sắc cho từng vị trí danh mục
const COLOR_PALETTE = [
  { bg: "bg-rose-500", text: "text-rose-600", lightBg: "bg-rose-50", stroke: "#f43f5e" },
  { bg: "bg-amber-500", text: "text-amber-600", lightBg: "bg-amber-50", stroke: "#f59e0b" },
  { bg: "bg-indigo-500", text: "text-indigo-600", lightBg: "bg-indigo-50", stroke: "#6366f1" },
  { bg: "bg-emerald-500", text: "text-emerald-600", lightBg: "bg-emerald-50", stroke: "#10b981" },
  { bg: "bg-purple-500", text: "text-purple-600", lightBg: "bg-purple-50", stroke: "#a855f7" },
  { bg: "bg-cyan-500", text: "text-cyan-600", lightBg: "bg-cyan-50", stroke: "#06b6d4" },
  { bg: "bg-slate-500", text: "text-slate-600", lightBg: "bg-slate-50", stroke: "#64748b" },
];

export default function AnalyticsChart({ categories = [], totalExpense = 0 }) {
  const formatMoney = (num) => {
    return Number(num).toLocaleString("vi-VN") + " đ";
  };

  // Tạo lời khuyên hóm hỉnh kiểu Gen Z
  const getGenZAdvice = () => {
    if (categories.length === 0 || totalExpense === 0) {
      return "Chưa có khoản chi tiêu nào! Bạn đang giữ ví rất chắc tay đó nha! 🎉";
    }

    const topCategory = categories[0];
    if (topCategory.category.includes("Trà sữa") || topCategory.category.includes("Cà phê")) {
      return `🧋 Báo động nhẹ: Bạn đã dành ${topCategory.percentage}% tiền chi tiêu cho Trà sữa / Cà phê! Cắt giảm 2 ly/tuần là đủ tiền mua khoá học hoặc đi du lịch đấy.`;
    }
    if (topCategory.category.includes("Mua sắm")) {
      return `🛍️ Cảnh báo ví mỏng: ${topCategory.percentage}% tiền đang bay vào Mua sắm! Áp dụng quy tắc "chờ 72h" trước khi chốt đơn Shopee/Tiktok Shop nha.`;
    }
    if (topCategory.category.includes("Ăn uống")) {
      return `🍜 Đam mê ăn uống chiếm đến ${topCategory.percentage}% ví tiền! Ăn ngon là chuẩn nhưng rủ bạn bè nấu ăn tại nhà vừa vui vừa tiết kiệm nè.`;
    }
    if (topCategory.category.includes("Tiền trọ") || topCategory.category.includes("Nhà")) {
      return `🏠 Tiền nhà chiếm ${topCategory.percentage}% là khoản chi cố định tất yếu. Các khoản còn lại bạn phân bổ khá hợp lý rồi đó!`;
    }
    return `✨ Chi tiêu tháng này đang khá cân bằng. Cứ duy trì phong độ kỷ luật tài chính này nhé!`;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Cơ cấu chi tiêu</h3>
            <p className="text-xs text-slate-400">Tiền của bạn đã đi đâu trong tháng?</p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
          Tổng chi: {formatMoney(totalExpense)}
        </span>
      </div>

      {/* Lời khuyên dí dỏm cho Gen Z */}
      <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 text-xs font-semibold text-amber-900 flex items-start gap-2.5 leading-relaxed">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>{getGenZAdvice()}</p>
      </div>

      {categories.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Chưa có dữ liệu chi tiêu để vẽ biểu đồ thống kê.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Thanh phân bổ đa sắc trực quan (Stacked Bar Chart) */}
          <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            {categories.map((item, index) => {
              const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
              return (
                <div
                  key={item.category}
                  className={`${color.bg} transition-all duration-500 hover:opacity-90`}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.category}: ${item.percentage}% (${formatMoney(item.total)})`}
                />
              );
            })}
          </div>

          {/* Danh sách từng danh mục chi tiết */}
          <div className="space-y-3 pt-2">
            {categories.map((item, index) => {
              const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${color.bg} shrink-0`}
                      />
                      <span className="font-bold text-slate-800">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({item.count} giao dịch)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">
                        {formatMoney(item.total)}
                      </span>
                      <span
                        className={`text-[11px] font-black px-2 py-0.5 rounded-md ${color.lightBg} ${color.text}`}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Thanh tiến độ con cho từng danh mục */}
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${color.bg} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
