import { ChevronDown, History } from "lucide-react";
import type { PropertyDetailsData } from "../normalizeProperty";
import { formatDate, formatPrice } from "../helpers";

interface ListingHistoryCardProps {
  property: PropertyDetailsData;
  expanded: boolean;
  onToggle: VoidFunction;
}

export function ListingHistoryCard({ property, expanded, onToggle }: ListingHistoryCardProps) {
  // Check if property is For Lease based on MlsStatus
  const isForLease = property.MlsStatus?.toLowerCase().includes('for lease') || false;
  
  const formatPriceWithLease = (price: number): string => {
    const basePrice = formatPrice(price);
    return isForLease ? `${basePrice} /month` : basePrice;
  };
  return (
    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden">
      <div className="p-6">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between hover:bg-orange-50/50 transition-all duration-300 group rounded-lg p-2 -m-2"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm">
              <History className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Listing History</h3>
              <p className="text-sm text-slate-500 font-medium">Property listing timeline and changes</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-orange-500 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </button>
        <div className="w-20 h-px bg-gradient-to-r from-orange-400 to-amber-500 mt-4"></div>
      </div>
      {expanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-3">
            <div className="hidden md:grid grid-cols-6 gap-3 p-3 bg-slate-50/50 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-wider">
              <div>Date Listed</div>
              <div>List Price</div>
              <div>Listing End</div>
              <div>Status</div>
              <div>Sold Price</div>
              <div>MLS#</div>
            </div>
            <div className="hidden md:grid grid-cols-6 gap-3 p-3 hover:bg-slate-50/30 transition-all duration-300 rounded-lg border-b border-slate-200/60">
              <div className="text-sm font-semibold text-slate-800">{property.ListDate ? formatDate(property.ListDate) : "N/A"}</div>
              <div className="text-sm font-semibold text-slate-800">{formatPriceWithLease(property.ListPrice || 0)}</div>
              <div className="text-sm font-semibold text-slate-800">Active</div>
              <div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-current/20">
                  Active
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-800">N/A</div>
              <div className="text-sm font-semibold text-slate-800 font-mono">{property.MLSNumber || "N/A"}</div>
            </div>
            <div className="md:hidden p-3 bg-white rounded-lg border border-slate-200/60 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600 uppercase">MLS# {property.MLSNumber || "N/A"}</span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-current/20">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Date Listed</div>
                  <div className="text-sm font-semibold text-slate-800">{property.ListDate ? formatDate(property.ListDate) : "N/A"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">List Price</div>
                  <div className="text-sm font-semibold text-slate-800">{formatPriceWithLease(property.ListPrice || 0)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Listing End</div>
                  <div className="text-sm font-semibold text-slate-800">Active</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Sold Price</div>
                  <div className="text-sm font-semibold text-slate-800">N/A</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


