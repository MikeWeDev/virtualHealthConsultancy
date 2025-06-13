'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';

export default function VideoCall() {
  const { id } = useParams() as { id: string };
  const roomId = id;

 const localVideoRef = useRef<HTMLVideoElement | null>(null);
const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

const socket = useRef<Socket | null>(null);
const pc = useRef<RTCPeerConnection | null>(null);
const localStream = useRef<MediaStream | null>(null);
const isInitiator = useRef<boolean>(false);


  useEffect(() => {
    if (!roomId) return;

    // 1. Connect socket (relative URL, same host)
    socket.current = io({
      path: '/api/video/socket',
    });

    // 2. Create RTCPeerConnection
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    // 3. negotiationneeded → only initiator creates offer
    pc.current.onnegotiationneeded = async () => {
      if (!isInitiator.current) return;
      try {
        const offer = await pc.current!.createOffer();
        await pc.current!.setLocalDescription(offer);
        socket.current!.emit('webrtc-signal', { type: 'offer', offer, roomId });
      } catch (e) {
        console.error('Negotation error:', e);
      }
    };

    // 4. ICE candidates → send to peer
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current!.emit('webrtc-signal', {
          type: 'candidate',
          candidate: event.candidate,
          roomId,
        });
      }
    };

    // 5. Incoming track → attach & play
    pc.current.ontrack = (event) => {
      const [remote] = event.streams;
      if (remote && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remote;
        remoteVideoRef.current.play().catch((err) =>
          console.warn('Remote play failed:', err)
        );
      }
    };

    // 6. Get local media, show it & add tracks
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
        stream.getTracks().forEach((track) => {
          pc.current!.addTrack(track, stream);
        });
        socket.current!.emit('join', roomId);
      })
      .catch((err) => {
        console.error('getUserMedia failed:', err);
        alert('Camera & microphone access are required.');
      });

    // 7. Signaling handlers:
    socket.current.on('you-are-initiator', () => {
      console.log('🧭 I am the initiator');
      isInitiator.current = true;
    });

    socket.current.on('webrtc-signal', async (data) => {
      if (!pc.current) return;
      try {
        if (data.type === 'offer') {
          console.log('📨 Got offer');
          await pc.current.setRemoteDescription(data.offer);
          const answer = await pc.current.createAnswer();
          await pc.current.setLocalDescription(answer);
          socket.current!.emit('webrtc-signal', { type: 'answer', answer, roomId });
        }
        if (data.type === 'answer') {
          console.log('📨 Got answer');
          await pc.current.setRemoteDescription(data.answer);
        }
        if (data.type === 'candidate') {
          // console.log('📨 Got candidate');
          await pc.current.addIceCandidate(data.candidate);
        }
      } catch (e) {
        console.error('Signal handling error:', e);
      }
    });

    // no-op: negotiationneeded covers sending the offer
    socket.current.on('user-joined', () => {});

    socket.current.on('user-left', () => {
      console.log('👋 Peer left');
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    });

    // 8. Cleanup on unmount
    return () => {
      socket.current!.emit('leave', roomId);
      socket.current!.disconnect();
      pc.current!.close();
      localStream.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomId]);

  return (
    <div className="flex space-x-4 p-4">
      <div>
        <h3>Your Camera</h3>
        <video ref={localVideoRef} muted playsInline className="w-60 h-40 bg-black" />
      </div>
      <div>
        <h3>Remote Camera</h3>
        <video
          ref={remoteVideoRef}
          playsInline
          className="w-60 h-40 bg-black"
        />
      </div>
    </div>
  );
}
