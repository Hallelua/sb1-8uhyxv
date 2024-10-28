import { useState, useRef } from 'react';
import Webcam from 'react-webcam';

export default function VideoRecorder({ onRecordingComplete }: { onRecordingComplete: (blob: Blob) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const handleStartRecording = () => {
    setRecordedChunks([]);
    if (webcamRef.current) {
      const stream = webcamRef.current.video?.srcObject as MediaStream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleDataAvailable = ({ data }: BlobEvent) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      onRecordingComplete(blob);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        audio={true}
        className="rounded-lg shadow-lg"
      />
      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
}