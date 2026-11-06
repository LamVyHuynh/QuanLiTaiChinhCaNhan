import { Sparkles, Wifi, WifiOff } from "lucide-react";

export default function Header({ isOnline }) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Ví Gen Z 💸
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Quản lý chi tiêu dễ thở, ví lúc nào cũng rủng rỉnh
          </p>
        </div>
      </div>

      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          isOnline
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
            : "bg-amber-50 text-amber-700 border border-amber-200/60"
        }`}
        title={isOnline ? "Đang đồng bộ với Node.js Backend" : "Đang lưu tạm LocalStorage (Backend chưa mở)"}
      >
        {isOnline ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">API Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Offline Mode</span>
          </>
        )}
      </div>
    </header>
  );
}
