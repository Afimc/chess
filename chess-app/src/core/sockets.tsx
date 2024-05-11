import { io } from 'socket.io-client';

interface IENV {
    VITE_SERVER_URL: string;
}

const ENV = (import.meta as any).env as IENV; 

const URL = ENV.VITE_SERVER_URL;

export const socket = io(URL, { autoConnect: false });

