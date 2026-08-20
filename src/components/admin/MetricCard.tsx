import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trendValue?: string; // Ex: "+12%" ou "-2%"
  trendIsPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  trendValue, 
  trendIsPositive = true, 
  icon: Icon,
  subtitle
}: Readonly<MetricCardProps>) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-[#fcfaf5] text-[#8c6b23] rounded-md">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        
        {trendValue && (
          <span className={`text-sm font-bold flex items-center gap-1 ${
            trendIsPositive ? "text-green-600" : "text-red-500"
          }`}>
            {trendValue} 
            {trendIsPositive ? "↗" : "↘"}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
          {title}
        </h3>
        <p className="text-3xl font-bold text-gray-900">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
}