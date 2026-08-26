'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter, useParams } from 'next/navigation';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import Navbar from '../../../../components/Nav';
import { useUser } from '../../../context/UserContext';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://virtua-health-consultancy-server.onrender.com';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function VideoCall() {
  const { id } = useParams() as { id: string };
  const roomId = id;

  const { user } = useUser();

  // Check if the user is a doctor or patient
  const isDoctor =
    user?.role?.toLowerCase() === 'doc' ||
    user?.role?.toLowerCase() === 'doctor';

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const socket = useRef<Socket | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const candidateQueue = useRef<RTCIceCandidateInit[]>([]);

  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Initializing...');
  const router = useRouter();

  useEffect(() => {
    if (!roomId) return;

    let isMounted = true;

    // 1. Initialize WebRTC PeerConnection
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    pc.current = peerConnection;

    // 2. Setup Remote Stream Receiver
    const remoteStream = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    // 3. Initialize Socket Connection to Render Backend
    const socketInstance = io(BACKEND_URL, {
      path: '/api/socket',
      withCredentials: true,
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
      timeout: 60000,
    });
    socket.current = socketInstance;

    // 4. ICE Candidate Emission
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketInstance.emit('signal', {
          roomId,
          type: 'candidate',
          candidate: event.candidate,
        });
      }
    };

    // 5. Get User Local Media
    async function startLocalStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStream.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        // Join the WebRTC room
        socketInstance.emit('join', roomId);
        setConnectionStatus('Waiting for partner...');
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setConnectionStatus('Camera/Mic Permission Denied');
      }
    }

    startLocalStream();

    // 6. Handle Socket Signaling Events
    socketInstance.on('user-joined', async () => {
      setConnectionStatus('Partner joined. Creating offer...');
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socketInstance.emit('signal', {
          roomId,
          type: 'offer',
          offer,
        });
      } catch (err) {
        console.error('Failed to create offer:', err);
      }
    });

    socketInstance.on('signal', async (data) => {
      if (!isMounted) return;

      try {
        if (data.type === 'offer') {
          setConnectionStatus('Connecting...');
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

          // Process queued candidates
          while (candidateQueue.current.length > 0) {
            const cand = candidateQueue.current.shift();
            if (cand) await peerConnection.addIceCandidate(new RTCIceCandidate(cand));
          }

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          socketInstance.emit('signal', {
            roomId,
            type: 'answer',
            answer,
          });
        } else if (data.type === 'answer') {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          setConnectionStatus('Connected');
        } else if (data.type === 'candidate' && data.candidate) {
          if (peerConnection.remoteDescription) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          } else {
            candidateQueue.current.push(data.candidate);
          }
        }
      } catch (err) {
        console.error('Signaling error:', err);
      }
    });

    socketInstance.on('user-left', () => {
      setConnectionStatus('Partner disconnected');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    // Cleanup tracks, sockets, and connections on unmount
    return () => {
      isMounted = false;
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
      if (socketInstance) {
        socketInstance.emit('leave', roomId);
        socketInstance.disconnect();
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [roomId]);

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = muted;
        setMuted(!muted);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = videoOff;
        setVideoOff(!videoOff);
      }
    }
  };

  const leaveCall = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    router.push('/');
  };

  return (
    <div className={`bg-slate-900 text-white flex flex-col justify-between ${isDoctor ? 'h-screen' : 'min-h-screen'}`}>
      {/* Show Navbar ONLY if the user is NOT a doctor */}
      {!isDoctor && <Navbar />}

      <div className={`flex-1 flex items-center justify-center ${isDoctor ? 'p-0 md:p-6' : 'p-4'}`}>
        <div className={`w-full bg-slate-800 shadow-xl overflow-hidden border border-slate-700 flex flex-col justify-between ${
          isDoctor ? 'h-full max-w-none rounded-none md:rounded-2xl' : 'max-w-5xl rounded-2xl'
        }`}>
          
          {/* Connection Banner with Doctor Back Button */}
          <div className="bg-slate-700/50 px-6 py-3 flex items-center justify-between text-sm font-medium text-slate-300">
            <div className="flex items-center gap-3">
              {isDoctor && (
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="p-1.5 -ml-2 text-slate-300 hover:text-white hover:bg-slate-600/50 rounded-full transition flex-shrink-0"
                  title="Go to previous page"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
              )}
              <span>
                Status: <span className="text-blue-400 font-semibold">{connectionStatus}</span>
              </span>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 flex-1 items-center">
            <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-700 aspect-video w-full">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold">
                You {muted && '(Muted)'}
              </div>
            </div>

            <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-700 aspect-video w-full">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold">
                Partner
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex justify-center items-center gap-6 bg-slate-900/80 p-4 border-t border-slate-700">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition ${
                muted ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'
              }`}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <FiMicOff size={24} /> : <FiMic size={24} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition ${
                videoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'
              }`}
              title={videoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {videoOff ? <FiVideoOff size={24} /> : <FiVideo size={24} />}
            </button>

            <button
              onClick={leaveCall}
              className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition"
              title="Leave Call"
            >
              <FiLogOut size={24} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}