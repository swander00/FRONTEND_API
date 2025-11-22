"use client";

import { useState, useEffect } from "react";
import { ChevronDown, History, Search, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PropertyDetailsData } from "../normalizeProperty";
import { formatDate, formatPrice } from "../helpers";
import { api } from "@/lib/api";
import type { ListingHistoryResponse } from "@/lib/api/types";

interface ListingHistoryCardProps {
  property: PropertyDetailsData;
  expanded: boolean;
  onToggle: VoidFunction;
}

export function ListingHistoryCard({ property, expanded, onToggle }: ListingHistoryCardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"history" | "priceChanges">("history");
  const [historyData, setHistoryData] = useState<ListingHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if property is For Lease based on MlsStatus
  const isForLease = property.MlsStatus?.toLowerCase().includes('for lease') || false;
  
  const formatPriceWithLease = (price: number): string => {
    const basePrice = formatPrice(price);
    return isForLease ? `${basePrice} /month` : basePrice;
  };

  // Fetch listing history when expanded
  useEffect(() => {
    if (expanded && !historyData && !loading && property.MLSNumber) {
      setLoading(true);
      setError(null);
      
      api.properties.getListingHistory(property.MLSNumber)
        .then((data) => {
          setHistoryData(data);
        })
        .catch((err) => {
          console.error('Failed to fetch listing history:', err);
          setError('Failed to load listing history');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [expanded, historyData, loading, property.MLSNumber]);

  const handleListingIdClick = (listingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/property/${encodeURIComponent(listingId)}`);
  };

  const getStatusBadgeColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('sold')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (statusLower.includes('terminated')) {
      return 'bg-orange-50 text-orange-700 border-orange-200';
    }
    if (statusLower.includes('expired')) {
      return 'bg-gray-50 text-gray-700 border-gray-200';
    }
    if (statusLower.includes('suspended')) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
    if (statusLower.includes('active')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const formatDateOnly = (dateString: string | null): string => {
    if (!dateString) return "Active";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return dateString;
    }
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
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="text-sm text-slate-500 mt-2">Loading listing history...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && historyData && (
            <>
              {/* Tabs */}
              <div className="flex gap-4 mb-4 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "history"
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Listing History
                </button>
                <button
                  onClick={() => setActiveTab("priceChanges")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "priceChanges"
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Price Changes {historyData.priceChanges.length > 0 && `(${historyData.priceChanges.length})`}
                </button>
              </div>

              {/* Listing History Tab */}
              {activeTab === "history" && (
                <div className="space-y-3">
                  {historyData.listingHistory.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">No listing history available</p>
                  ) : (
                    <>
                      {/* Desktop Table */}
                      <div className="hidden md:block">
                        <div className="grid grid-cols-5 gap-3 p-3 bg-slate-50/50 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-wider">
                          <div>Date Start</div>
                          <div>Date End</div>
                          <div>Price</div>
                          <div>Event</div>
                          <div>Listing ID</div>
                        </div>
                        {historyData.listingHistory.map((entry, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-5 gap-3 p-3 hover:bg-slate-50/30 transition-all duration-300 rounded-lg border-b border-slate-200/60"
                          >
                            <div className="text-sm font-semibold text-slate-800">
                              {formatDateOnly(entry.dateStart)}
                            </div>
                            <div className="text-sm font-semibold text-slate-800">
                              {formatDateOnly(entry.dateEnd)}
                            </div>
                            <div className="text-sm font-semibold text-slate-800">
                              {formatPriceWithLease(entry.price)}
                            </div>
                            <div>
                              <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor(entry.event)}`}>
                                {entry.event}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-slate-800 font-mono">
                              <button
                                onClick={(e) => handleListingIdClick(entry.listingId, e)}
                                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
                              >
                                {entry.listingId}
                                <Search className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden space-y-3">
                        {historyData.listingHistory.map((entry, index) => (
                          <div
                            key={index}
                            className="p-3 bg-white rounded-lg border border-slate-200/60 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <button
                                onClick={(e) => handleListingIdClick(entry.listingId, e)}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-mono"
                              >
                                MLS# {entry.listingId}
                                <Search className="h-3 w-3" />
                              </button>
                              <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadgeColor(entry.event)}`}>
                                {entry.event}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Date Start</div>
                                <div className="text-sm font-semibold text-slate-800">{formatDateOnly(entry.dateStart)}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Date End</div>
                                <div className="text-sm font-semibold text-slate-800">{formatDateOnly(entry.dateEnd)}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Price</div>
                                <div className="text-sm font-semibold text-slate-800">{formatPriceWithLease(entry.price)}</div>
                              </div>
                              {entry.soldPrice && (
                                <div>
                                  <div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Sold Price</div>
                                  <div className="text-sm font-semibold text-slate-800">{formatPriceWithLease(entry.soldPrice)}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Price Changes Tab */}
              {activeTab === "priceChanges" && (
                <div className="space-y-3">
                  {historyData.priceChanges.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">No price changes available</p>
                  ) : (
                    <>
                      {/* Desktop Table */}
                      <div className="hidden md:block">
                        <div className="grid grid-cols-4 gap-3 p-3 bg-slate-50/50 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-wider">
                          <div>Date</div>
                          <div>Price</div>
                          <div>Change</div>
                          <div>Event</div>
                        </div>
                        {historyData.priceChanges.map((change, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-4 gap-3 p-3 hover:bg-slate-50/30 transition-all duration-300 rounded-lg border-b border-slate-200/60"
                          >
                            <div className="text-sm font-semibold text-slate-800">
                              {formatDateOnly(change.date)}
                            </div>
                            <div className="text-sm font-semibold text-slate-800">
                              {formatPriceWithLease(change.price)}
                            </div>
                            <div className="text-sm font-semibold">
                              {change.change !== null ? (
                                <span className={`flex items-center gap-1 ${change.change < 0 ? 'text-red-600' : change.change > 0 ? 'text-green-600' : 'text-slate-600'}`}>
                                  {change.change < 0 ? <ArrowDown className="h-4 w-4" /> : change.change > 0 ? <ArrowUp className="h-4 w-4" /> : null}
                                  {Math.abs(change.change).toFixed(1)}%
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </div>
                            <div className="text-sm font-semibold text-slate-800">
                              {change.event}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden space-y-3">
                        {historyData.priceChanges.map((change, index) => (
                          <div
                            key={index}
                            className="p-3 bg-white rounded-lg border border-slate-200/60 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-slate-600 uppercase">{change.event}</span>
                              {change.change !== null && (
                                <span className={`flex items-center gap-1 text-sm font-semibold ${change.change < 0 ? 'text-red-600' : change.change > 0 ? 'text-green-600' : 'text-slate-600'}`}>
                                  {change.change < 0 ? <ArrowDown className="h-4 w-4" /> : change.change > 0 ? <ArrowUp className="h-4 w-4" /> : null}
                                  {Math.abs(change.change).toFixed(1)}%
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Date</div>
                                <div className="text-sm font-semibold text-slate-800">{formatDateOnly(change.date)}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 font-medium uppercase mb-0.5">Price</div>
                                <div className="text-sm font-semibold text-slate-800">{formatPriceWithLease(change.price)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
