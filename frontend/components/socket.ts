import { io } from 'socket.io-client';
import { BACKEND } from './api';
 
export const socket = io(BACKEND, {
 path: '/socket.io/',
 transports: ['websocket']
});
