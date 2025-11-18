"use client";

import { useMemo } from "react";
import { Bed, Bath, ChefHat, Home, Layout, type LucideIcon } from "lucide-react";
import { usePropertyRooms, type PropertyRoomDetails } from "@/hooks/usePropertyRooms";

export interface RoomInfo {
  roomType?: string | null;
  level: string;
  roomDimensions: string;
  roomFeatures: string[];
  icon: LucideIcon;
}

export function mapRoomsToRoomInfo(rooms: PropertyRoomDetails[]): RoomInfo[] {
  if (!rooms || rooms.length === 0) return [];

  return rooms.map((room: PropertyRoomDetails) => {
    const roomTypeLabel = room.RoomType ?? "Room";
    const roomType = room.RoomType?.toLowerCase() || "";

    let icon: LucideIcon = Layout;

    if (roomType.includes("bedroom")) {
      icon = Bed;
    } else if (roomType.includes("bathroom")) {
      icon = Bath;
    } else if (roomType.includes("kitchen")) {
      icon = ChefHat;
    } else if (roomType.includes("living") || roomType.includes("family")) {
      icon = Home;
    }

    const features = room.RoomFeatures ? room.RoomFeatures.split(",").map((feature) => feature.trim()).filter(Boolean) : [];
    const dimensions = room.RoomDimensions && room.RoomDimensions !== "N/A" ? `${room.RoomDimensions} feet` : "N/A";

    return {
      roomType: roomTypeLabel,
      level: room.RoomLevel || "Unknown Level",
      roomDimensions: dimensions,
      roomFeatures: features,
      icon,
    };
  });
}

export function useRoomDetails(mlsNumber: string) {
  const { rooms, loading, error } = usePropertyRooms(mlsNumber);

  const formattedRooms = useMemo<RoomInfo[]>(() => mapRoomsToRoomInfo(rooms), [rooms]);

  return {
    rooms: formattedRooms,
    loading,
    error,
  };
}


