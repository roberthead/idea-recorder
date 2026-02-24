import type { Message } from "../api/messages";

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function MessageCard({ message }: { message: Message }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <p className="text-base text-gray-900">{message.transcript}</p>
      <time className="mt-2 block text-xs text-gray-400" dateTime={message.created_at}>
        {timeAgo(message.created_at)}
      </time>
    </div>
  );
}
