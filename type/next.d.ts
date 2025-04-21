// types/next.d.ts
import { Socket } from 'socket.io';

declare global {
  namespace NodeJS {
    interface IncomingMessage {
      socket: Socket & { server: any }; // Extend the socket to have the `server` property
    }
  }
}
