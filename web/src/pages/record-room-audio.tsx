import { Button } from "@/components/ui/button";
import { MicIcon, StopCircleIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === "function" &&
  typeof window.MediaRecorder === "function";

type RoomParams = {
  id: string;
};

export function RecordRoomAudio() {
  const params = useParams<RoomParams>();
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function stopRecording() {
    setIsRecording(false);

    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.stop();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }

  async function uploadAudio(blob: Blob) {
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");
    const response = await fetch(
      `http://localhost:3003/rooms/${params.id}/audio`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      throw new Error("Failed to upload audio");
    }
  }

  function createRecorder(audio: MediaStream) {
    recorder.current = new MediaRecorder(audio, {
      mimeType: "audio/webm",
      audioBitsPerSecond: 64_000,
    });
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert("Não é possível gravar o áudio");
      return;
    }

    setIsRecording(true);

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    });

    recorder.current = new MediaRecorder(audio, {
      mimeType: "audio/webm",
      audioBitsPerSecond: 64000,
    });

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        const blob = event.data;
        uploadAudio(blob);
      }
    };

    recorder.current.onstart = () => {
      console.log("Recording started");
    };

    recorder.current.onstop = () => {
      console.log("Recording stopped");
    };

    recorder.current.start();
    intervalRef.current = setInterval(() => {
      recorder.current?.stop();
      createRecorder(audio);
    }, 5000);
  }

  if (!params.id) {
    location.href = "/";
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!isRecording && (
        <Button onClick={startRecording}>
          <MicIcon />
          <span>Gravar</span>
        </Button>
      )}
      {isRecording && (
        <Button onClick={stopRecording}>
          <StopCircleIcon />
          <span>Parar gravação</span>
        </Button>
      )}
      {isRecording && <p>Gravando...</p>}
    </div>
  );
}
