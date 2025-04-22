'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';

const VideoCall = () => {
  const { id } = useParams() as { id: string };
  const roomId = id;
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // 1. Setup signaling socket
    socket.current = io('https://virtualhealthconsultancy-production.up.railway.app/', {
      path: '/api/video/socket',
    });

    // 2. Setup peer connection
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // 3. Handle ICE candidate
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit('webrtc-signal', {
          type: 'candidate',
          candidate: event.candidate,
          roomId,
        });
      }
    };

    // 4. Handle remote track
    pc.current.ontrack = (event) => {
      console.log('🎥 Remote track received');
      setRemoteStream(event.streams[0]);
    };

    // 5. Get local media and join room
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setLocalStream(stream);
      if (localVideo.current) {
        localVideo.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        pc.current?.addTrack(track, stream);
      });

      socket.current?.emit('join-room', roomId);
    });

    // 6. Handle signaling
    socket.current.on('webrtc-signal', async (data) => {
      if (!pc.current) return;

      switch (data.type) {
        case 'offer':
          await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.current.createAnswer();
          await pc.current.setLocalDescription(answer);
          socket.current?.emit('webrtc-signal', { type: 'answer', answer, roomId });
          break;

        case 'answer':
          await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          break;

        case 'candidate':
          if (data.candidate) {
            await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
          break;
      }
    });

    // 7. Start call if second user joins
    socket.current.on('ready-for-call', async () => {
      const offer = await pc.current!.createOffer();
      await pc.current!.setLocalDescription(offer);
      socket.current?.emit('webrtc-signal', { type: 'offer', offer, roomId });
    });

    return () => {
      socket.current?.disconnect();
      pc.current?.close();
    };
  }, [roomId]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <header className="w-full max-w-4xl px-4 py-6 bg-white shadow rounded-lg mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Room ID: {roomId}
        </h1>
      </header>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 px-4">
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
    </div>
  );
};

export default VideoCall;
