
'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter, useParams } from 'next/navigation';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiLogOut } from 'react-icons/fi';

export default function VideoCall() {
  const { id } = useParams() as { id: string };
  const roomId = id;

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteStreamRef = useRef<MediaStream>(new MediaStream());

  const socket = useRef<Socket | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const isInitiator = useRef<boolean>(false);
  const offerSent = useRef<boolean>(false);

  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const router = useRouter();

 useEffect(() => {
  if (!roomId) return;

  socket.current = io(process.env.NEXT_PUBLIC_API_URL!, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
  });

  pc.current = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  // ...
}, [roomId]);

  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => (track.enabled = muted));
      setMuted(!muted);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(track => (track.enabled = videoOff));
      setVideoOff(!videoOff);
    }
  };

  const leaveCall = () => router.push('/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-100 to-indigo-50 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl bg-black rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 p-2">
          <div className="relative border-4 border-purple-500 rounded-lg overflow-hidden">
            <video ref={localVideoRef} muted playsInline className="object-cover w-full h-64 md:h-80 transform transition-transform hover:scale-105" />
            <div className="absolute bottom-2 left-2 bg-purple-600 bg-opacity-75 text-white px-3 py-1 rounded-lg font-semibold">You</div>
          </div>
          <div className="relative border-4 border-pink-500 rounded-lg overflow-hidden">
            <video ref={remoteVideoRef} playsInline className="object-cover w-full h-64 md:h-80 transform transition-transform hover:scale-105" />
            <div className="absolute bottom-2 left-2 bg-pink-600 bg-opacity-75 text-white px-3 py-1 rounded-lg font-semibold">Partner</div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-8 bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-4">
          <button onClick={toggleMute} className="p-4 bg-white bg-opacity-30 backdrop-blur-md rounded-full shadow-lg hover:bg-opacity-50 transition">
            {muted ? <FiMicOff size={28} className="text-red-500" /> : <FiMic size={28} className="text-green-500" />}
          </button>
          <button onClick={toggleVideo} className="p-4 bg-white bg-opacity-30 backdrop-blur-md rounded-full shadow-lg hover:bg-opacity-50 transition">
            {videoOff ? <FiVideoOff size={28} className="text-red-500" /> : <FiVideo size={28} className="text-green-500" />}
          </button>
          <button onClick={leaveCall} className="p-4 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition">
            <FiLogOut size={28} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
