// import io from 'socket.io-client';

// const socket = io('http://localhost:8000');

// export default socket;

import { io } from "socket.io-client";

let socket: any;

export const connectSocket = (sessionId: String) => {
    socket = io("http://localhost:3001", {
        query: {
            userId: sessionId,
        },
    });
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const onSocketEvent = (eventName: String, callback: any) => {
    if (socket) {
        socket.on(eventName, callback);
    }
};

export const offSocketEvent = (eventName: String, callback?: any) => {
    if (socket) {
        socket.off(eventName, callback);
    }
};

export const onSocketEmit = (eventName: String, callback: any) => {
    if (socket) {
        socket.emit(eventName, callback);
    }
};
