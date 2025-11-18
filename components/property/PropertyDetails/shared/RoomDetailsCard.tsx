import { ChevronDown, Layout, Loader2, MapPin, Ruler } from "lucide-react";
import type { RoomInfo } from "../hooks/useRoomDetails";

interface RoomDetailsCardProps {
  property: {
    Bedrooms?: number | null;
    Bathrooms?: number | null;
    SquareFootage?: number | null;
  };
  rooms: RoomInfo[];
  expanded: boolean;
  onToggle: VoidFunction;
  loading: boolean;
  error?: string | null;
}

export function RoomDetailsCard({ property, rooms, expanded, onToggle, loading, error }: RoomDetailsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Layout className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Room Details</h3>
              <p className="text-xs text-gray-500">{rooms.length > 0 ? `${rooms.length} rooms` : "Limited data"}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${rooms.length > 0 ? "bg-green-400" : "bg-gray-300"}`}></div>
            <span className="text-xs text-gray-500">{rooms.length > 0 ? "Available" : "Limited"}</span>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center gap-2">
            <Layout className="h-3 w-3 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">
              {loading ? "Loading..." : rooms.length > 0 ? "View Room Details" : "No Room Data"}
            </span>
          </div>
          <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
        {expanded && (
          <div className="mt-3">
            {loading ? (
              <div className="text-center py-6">
                <Loader2 className="h-5 w-5 text-indigo-500 mx-auto mb-2 animate-spin" />
                <p className="text-gray-600 text-xs">Loading room details...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6">
                <Layout className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-600 text-xs">Error loading room details</p>
              </div>
            ) : rooms.length > 0 ? (
              <div className="overflow-x-auto -mx-2">
                <div className="min-w-full inline-block align-middle">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Room Type
                    </div>
                    <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Room Level
                    </div>
                    <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Dimensions
                    </div>
                    <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Features
                    </div>
                  </div>
                  {/* Table Rows */}
                  <div className="divide-y divide-gray-100">
                    {rooms.map((room, index) => (
                      <div 
                        key={`${room.roomType}-${index}`} 
                        className="grid grid-cols-4 gap-4 px-4 py-3 bg-white hover:bg-gray-50 transition-colors duration-150"
                      >
                        {/* Room Type Column */}
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex-shrink-0 p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                            <room.icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {room.roomType || "N/A"}
                          </span>
                        </div>
                        
                        {/* Room Level Column */}
                        <div className="flex items-center min-w-0">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">
                              {room.level || "N/A"}
                            </span>
                          </div>
                        </div>
                        
                        {/* Dimensions Column */}
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Ruler className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {room.roomDimensions || "N/A"}
                          </span>
                        </div>
                        
                        {/* Features Column */}
                        <div className="flex flex-wrap gap-1.5 items-center min-w-0">
                          {room.roomFeatures && room.roomFeatures.length > 0 ? (
                            room.roomFeatures.slice(0, 3).map((feature, featureIndex) => (
                              <span
                                key={`${feature}-${featureIndex}`}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 whitespace-nowrap"
                              >
                                {feature}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">None</span>
                          )}
                          {room.roomFeatures && room.roomFeatures.length > 3 && (
                            <span className="text-xs text-gray-500 font-medium">
                              +{room.roomFeatures.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Layout className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-xs font-medium">No room details available</p>
                <p className="text-gray-500 text-xs mt-1">Room data available for ~43% of listings</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

