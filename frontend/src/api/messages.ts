import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "./client";

export interface Message {
  id: string;
  transcript: string;
  duration_seconds: number | null;
  created_at: string;
}

export async function fetchMessages(): Promise<Message[]> {
  const { data } = await apiClient.get<Message[]>("/messages");
  return data;
}

export async function createMessage(audioBlob: Blob): Promise<Message> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  const { data } = await apiClient.post<Message>("/messages", formData);
  return data;
}

export function useMessages() {
  return useQuery({ queryKey: ["messages"], queryFn: fetchMessages });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}
