'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';

const VideoCall = () => {
  const { id } = useParams() as { id: string };
  const roomId = id;

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const socket = useRef<Socket | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // Connect to backend socket server
    socket.current = io('/', {
      path: '/api/video/socket',
    });

    // Initialize PeerConnection
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // Handle remote track
    pc.current.ontrack = (event) => {
      const [remote] = event.streams;
      if (remote) {
        console.log('📡 Received remote stream');
        setRemoteStream(remote);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remote;
        }
      }
    };

    // Handle ICE candidates
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit('webrtc-signal', {
          type: 'candidate',
          candidate: event.candidate,
          roomId,
        });
      }
    };

    // Get local media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        pc.current?.addTrack(track, stream);
      });

      socket.current?.emit('join', roomId);
    });

    // Handle signaling messages
    socket.current.on('webrtc-signal', async (data) => {
      if (!pc.current) return;

      try {
        switch (data.type) {
          case 'offer':
            console.log('📨 Received offer');
            await pc.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            socket.current?.emit('webrtc-signal', { type: 'answer', answer, roomId });
            break;

          case 'answer':
            console.log('📨 Received answer');
            await pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            break;

          case 'candidate':
            console.log('📨 Received candidate');
            await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            break;
        }
      } catch (err) {
        console.error('⚠️ WebRTC signal error:', err);
      }
    });

    // Handle user joining
    socket.current.on('user-joined', async () => {
      console.log('👥 User joined, sending offer');
      if (!pc.current) return;
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.current?.emit('webrtc-signal', { type: 'offer', offer, roomId });
    });

    // Handle user leaving
    socket.current.on('user-left', () => {
      console.log('👋 Remote user left');
      setRemoteStream(null);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    });

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up');
      socket.current?.emit('leave', roomId);
      socket.current?.disconnect();
      pc.current?.close();
      localStream.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomId]);

  // Ensure remote stream updates video
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const endCall = () => {
    console.log('📞 Ending call');
    socket.current?.emit('leave', roomId);
    socket.current?.disconnect();
    pc.current?.close();
    localStream.current?.getTracks().forEach((t) => t.stop());

    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    setRemoteStream(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <header className="w-full max-w-4xl px-4 py-6 bg-white shadow rounded-lg mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">Video Call Room: {roomId}</h1>
      </header>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 px-4">
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Video</h2>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 max-w-md object-cover rounded-lg shadow"
          />
        </div>

        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Remote Video</h2>
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-64 max-w-md object-cover rounded-lg shadow"
            />
          ) : (
            <div className="w-full h-64 max-w-md flex items-center justify-center bg-gray-200 rounded-lg shadow">
              <span className="text-gray-500">Waiting for remote user...</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={endCall}
          className="px-6 py-3 bg-red-500 text-white rounded-full shadow hover:bg-red-600"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
