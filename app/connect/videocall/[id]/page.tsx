'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';

const VideoCall = () => {
  const { id } = useParams() as { id: string };
  const roomId = id as string;
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<Socket | null>(null);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    // Initialize socket connection for video signaling.
    socket.current = io("http://192.168.1.5:3000", {
      path: "/api/video/socket",
    });

    // Create a new RTCPeerConnection with STUN servers.
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Handle ICE candidates by sending them via socket.
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit("webrtc-signal", {
          type: "candidate",
          candidate: event.candidate,
          roomId,
        });
      }
    };

    // When remote tracks arrive, set the remote stream.
    pc.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Acquire local media (camera and microphone).
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideo.current) {
          localVideo.current.srcObject = stream;
        }
        // Add tracks to the RTCPeerConnection if not closed.
        if (pc.current?.signalingState !== "closed") {
          stream.getTracks().forEach((track) => {
            pc.current?.addTrack(track, stream);
          });
        }
        // Emit a join event to the signaling server.
        socket.current?.emit("join", roomId);
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
      });

    // Listen for incoming signaling messages.
    socket.current.on("webrtc-signal", async (data) => {
      if (!pc.current) return;
      if (data.type === "offer") {
        await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        socket.current?.emit("webrtc-signal", { type: "answer", answer, roomId });
      } else if (data.type === "answer") {
        await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === "candidate") {
        await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    // When a new user joins, create an offer.
    socket.current.on("user-joined", async () => {
      if (!pc.current) return;
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.current?.emit("webrtc-signal", { type: "offer", offer, roomId });
      setIsCalling(true);
    });

    // Cleanup the connection on component unmount.
    return () => {
      socket.current?.disconnect();
      pc.current?.close();
    };
  }, [roomId]);

  const endCall = () => {
    socket.current?.disconnect();
    setIsCalling(false);
    pc.current?.close();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      {/* Header */}
      <header className="w-full max-w-4xl px-4 py-6 bg-white shadow rounded-lg mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Video Call Room: {roomId}
        </h1>
      </header>

      {/* Video Containers */}
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 px-4">
        {/* Local Video */}
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Video</h2>
          <video
            ref={localVideo}
            autoPlay
            playsInline
            muted
            className="w-full max-w-md border border-gray-300 rounded-lg shadow"
          />
        </div>
        {/* Remote Video */}
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Remote Video</h2>
          {remoteStream ? (
          <video
          ref={(el) => {
            if (el && remoteStream) {
              el.srcObject = remoteStream;
            }
            remoteVideo.current = el;
          }}
          autoPlay
          playsInline
          className="w-full max-w-md border border-gray-300 rounded-lg shadow"
        />
          ) : (
            <div className="w-full max-w-md h-64 flex items-center justify-center bg-gray-200 border border-gray-300 rounded-lg shadow">
              <span className="text-gray-500">Waiting for remote user...</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8">
        {!isCalling ? (
          <button
            onClick={() => socket.current?.emit("user-joined")}
            className="px-6 py-3 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition" >
            Join Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="px-6 py-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
