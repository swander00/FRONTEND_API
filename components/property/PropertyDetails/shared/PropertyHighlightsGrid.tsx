import type { SpecItem } from "../helpers";

interface PropertyHighlightsGridProps {
  specs: SpecItem[];
  title?: string;
  containerClassName?: string;
  gridClassName?: string;
  variant?: "default" | "plain";
}

export function PropertyHighlightsGrid({
  specs,
  title = "Quick Overview",
  containerClassName = "",
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3",
  variant = "default",
}: PropertyHighlightsGridProps) {
  if (specs.length === 0) {
    return null;
  }

  const containerBaseClass =
    variant === "plain"
      ? "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      : "bg-gradient-to-br from-white via-gray-50/50 to-white rounded-xl shadow-md border border-gray-200/60 overflow-hidden";

  const headerClass =
    variant === "plain"
      ? "px-4 py-2.5 bg-gray-50 border-b border-gray-200"
      : "px-4 py-2.5 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 border-b border-gray-200/50";

  return (
    <div className={`${containerBaseClass} ${containerClassName}`.trim()}>
      <div className={headerClass}>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>
      <div className="p-3 sm:p-4">
        <div className={gridClassName}>
          {specs.map((spec, index) => {
            const IconComponent = spec.icon;
            return (
              <div
                key={`${spec.label}-${index}`}
                className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-3 bg-white rounded-lg border border-gray-200/60 hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${spec.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}
                >
                  <IconComponent className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${spec.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight">{spec.label}</div>
                  <div className={`${spec.primary ? "text-sm sm:text-base" : "text-xs sm:text-sm"} font-bold text-gray-900 leading-tight truncate`}>
                    {spec.value}
                  </div>
                  {spec.helperText && (
                    <div className="text-[9px] sm:text-[10px] text-gray-400 leading-tight mt-0.5">
                      {spec.helperText}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


