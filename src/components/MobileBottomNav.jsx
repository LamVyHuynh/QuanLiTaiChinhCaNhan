import { ReceiptText, PieChart, Target } from "lucide-react";

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "transactions", label: "Sổ Thu Chi", icon: ReceiptText },
    { id: "analytics", label: "Biểu Đồ", icon: PieChart },
    { id: "budget", label: "Hạn Mức", icon: Target },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? "text-indigo-600 scale-105 font-black"
                  : "text-slate-400 hover:text-slate-600 font-medium"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? "bg-indigo-50 text-indigo-600" : "bg-transparent"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
