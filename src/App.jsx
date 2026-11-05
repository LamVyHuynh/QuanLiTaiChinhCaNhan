import { useState, useEffect } from "react";

export default function QuanLiTaiChinh() {
  // Lấy dữ liệu từ localStorage nếu có, không thì dùng mảng trống
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("trai_chinh_data");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "Lương tháng",
            amount: 12000000,
            type: "income",
            category: "Lương",
          },
          {
            id: 2,
            title: "Ăn trưa",
            amount: 35000,
            type: "expense",
            category: "Ăn uống",
          },
          {
            id: 3,
            title: "Đổ xăng",
            amount: 50000,
            type: "expense",
            category: "Đi lại",
          },
        ];
  });

  // State quản lý form nhập liệu
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense"); // 'expense' (chi) hoặc 'income' (thu)
  const [category, setCategory] = useState("Ăn uống");

  // Lưu dữ liệu vào localStorage mỗi khi danh sách thay đổi
  useEffect(() => {
    localStorage.setItem("trai_chinh_data", JSON.stringify(transactions));
  }, [transactions]);

  // Tính tổng thu, tổng chi và số dư
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Thêm giao dịch mới
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) {
      alert("Vui lòng nhập đầy đủ tên khoản thu/chi và số tiền nhé!");
      return;
    }

    const newTx = {
      id: Date.now(),
      title,
      amount: Number(amount),
      type,
      category,
    };

    setTransactions([newTx, ...transactions]);
    setTitle("");
    setAmount("");
  };

  // Xóa giao dịch
  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Hàm format tiền tệ VNĐ
  const formatMoney = (num) => {
    return Number(num).toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        {/* HEADER */}
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            💰 Quản Lý Tài Chính Cá Nhân
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Ghi chép thu chi gọn gàng, quản lý tiền bạc thông minh
          </p>
        </header>

        {/* THẺ TỔNG QUAN (DASHBOARD) */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
            <span className="text-xs text-slate-400 font-bold block mb-1">
              TỔNG DƯ
            </span>
            <span
              className={`text-sm sm:text-lg font-black ${balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}
            >
              {formatMoney(balance)}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
            <span className="text-xs text-slate-400 font-bold block mb-1">
              THU NHẬP
            </span>
            <span className="text-sm sm:text-lg font-black text-emerald-600">
              +{formatMoney(totalIncome)}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
            <span className="text-xs text-slate-400 font-bold block mb-1">
              CHI TIÊU
            </span>
            <span className="text-sm sm:text-lg font-black text-rose-600">
              -{formatMoney(totalExpense)}
            </span>
          </div>
        </div>

        {/* FORM NHẬP GIAO DỊCH */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 mb-6">
          <h2 className="text-base font-bold text-slate-800 mb-4">
            ➕ Thêm khoản thu / chi mới
          </h2>

          <form onSubmit={handleAddTransaction} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  type === "expense"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                💸 Khoản Chi
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  type === "income"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                💵 Khoản Thu
              </button>
            </div>

            <input
              type="text"
              placeholder="Tên khoản giao dịch (Ví dụ: Tiền điện, Mua áo...)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Số tiền (VNĐ)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Ăn uống">🍲 Ăn uống</option>
                <option value="Lương">💼 Lương</option>
                <option value="Đi lại">🛵 Đi lại</option>
                <option value="Mua sắm">🛍️ Mua sắm</option>
                <option value="Hóa đơn">⚡ Hóa đơn</option>
                <option value="Khác">📌 Khác</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-transform active:scale-95 shadow-md"
            >
              Lưu Giao Dịch
            </button>
          </form>
        </div>

        {/* LỊCH SỬ GIAO DỊCH */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-4">
            📋 Lịch sử thu chi
          </h2>

          {transactions.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-6">
              Chưa có giao dịch nào được ghi nhận.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                        t.type === "income"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {t.type === "income" ? "➕" : "➖"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {t.title}
                      </h4>
                      <span className="text-xs text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md font-medium">
                        {t.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-black text-sm ${t.type === "income" ? "text-emerald-600" : "text-slate-900"}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatMoney(t.amount)}
                    </span>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      title="Xóa"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
