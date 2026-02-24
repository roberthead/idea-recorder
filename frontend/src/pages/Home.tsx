import RecordButton from "../components/RecordButton";
import MessageList from "../components/MessageList";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8">
      <RecordButton />
      <MessageList />
    </div>
  );
}
