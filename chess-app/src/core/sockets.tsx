import { io } from 'socket.io-client';

const URL: string = 'http://localhost:3000';
// const URL: string = '78.130.159.107:3033';

export const socket = io(URL, { autoConnect: false });