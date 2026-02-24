import { AxiosError } from "axios";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useCreateMessage } from "../api/messages";

type RecordState = "idle" | "recording" | "submitting";

export default function RecordButton() {
  const { isRecording, startRecording, stopRecording, error } = useAudioRecorder();
  const createMessage = useCreateMessage();

  const state: RecordState = createMessage.isPending
    ? "submitting"
    : isRecording
      ? "recording"
      : "idle";

  const handleClick = async () => {
    if (state === "submitting") return;

    if (isRecording) {
      const blob = await stopRecording();
      createMessage.mutate(blob);
    } else {
      await startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={state === "submitting"}
        aria-label={state === "recording" ? "Stop recording" : "Start recording"}
        className={`flex h-20 w-20 items-center justify-center rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          state === "recording"
            ? "animate-pulse bg-red-600 focus:ring-red-500"
            : state === "submitting"
              ? "cursor-wait bg-gray-400"
              : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
        }`}
      >
        {state === "submitting" ? (
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : state === "recording" ? (
          <span className="h-6 w-6 rounded bg-white" />
        ) : (
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>
      <span className="text-sm text-gray-500">
        {state === "recording"
          ? "Recording... tap to stop"
          : state === "submitting"
            ? "Saving..."
            : "Tap to record"}
      </span>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {createMessage.isError && (
        <p className="text-sm text-red-600">
          {createMessage.error instanceof AxiosError &&
          createMessage.error.response?.data?.detail
            ? String(createMessage.error.response.data.detail)
            : "Failed to save message. Please try again."}
        </p>
      )}
    </div>
  );
}
