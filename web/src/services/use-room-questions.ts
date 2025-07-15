import type { GetRoomQuestionsResponse } from "@/types/get-room-questions-response";
import { useQuery } from "@tanstack/react-query";

export function useRoomQuestions(roomId: string) {
  return useQuery({
    queryKey: ["get-room-questions", roomId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3003/rooms/${roomId}/questions`);
      const result: GetRoomQuestionsResponse = await response.json();

      return result;
    },
  });
}