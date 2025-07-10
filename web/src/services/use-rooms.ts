import type { GetRoomsAPIResponse } from "@/types/get-rooms-response";
import { useQuery } from "@tanstack/react-query";

export function useRooms() {
  return useQuery({
    queryKey: ["get-rooms"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3003/rooms");
      const result: GetRoomsAPIResponse = await response.json();

      return result;
    },
  });
}