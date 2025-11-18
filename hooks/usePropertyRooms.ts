"use client";

import { useMemo } from "react";

export type PropertyRoomDetails = {
  RoomType?: string;
  RoomLevel?: string;
  RoomDimensions?: string;
  RoomFeatures?: string;
};

type UsePropertyRoomsResult = {
  rooms: PropertyRoomDetails[];
  loading: boolean;
  error: Error | null;
};

export function usePropertyRooms(_mlsNumber: string): UsePropertyRoomsResult {
  const rooms = useMemo<PropertyRoomDetails[]>(() => [], [_mlsNumber]);

  return {
    rooms,
    loading: false,
    error: null,
  };
}



