import { useMessages } from "../api/messages";
import MessageCard from "./MessageCard";

export default function MessageList() {
  const { data: messages, isLoading, isError } = useMessages();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-red-600">Failed to load messages.</p>;
  }

  if (!messages || messages.length === 0) {
    return <p className="text-center text-sm text-gray-400">No messages yet. Record your first idea!</p>;
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}
