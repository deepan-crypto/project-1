import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { authStorage } from './authStorage';
import API_BASE_URL from '@/config/api';

// Get the socket server URL (same as API but without /api)
const SOCKET_URL = API_BASE_URL.replace('/api', '');

// Singleton socket instance
let socketInstance: Socket | null = null;

/**
 * Hook for managing socket connection
 */
export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const initSocket = async () => {
            try {
                const user = await authStorage.getUser();

                if (!user?.id) {
                    console.log('No user logged in, skipping socket connection');
                    return;
                }

                // Create socket connection if not exists
                if (!socketInstance) {
                    socketInstance = io(SOCKET_URL, {
                        transports: ['websocket', 'polling'],
                        autoConnect: true,
                    });
                }

                socketRef.current = socketInstance;

                // Handle connection
                socketInstance.on('connect', () => {
                    console.log('Socket connected:', socketInstance?.id);
                    setIsConnected(true);

                    // Join user's personal room for notifications
                    socketInstance?.emit('join', user.id);
                });

                // Handle disconnection
                socketInstance.on('disconnect', () => {
                    console.log('Socket disconnected');
                    setIsConnected(false);
                });

                // Connect if not already connected
                if (!socketInstance.connected) {
                    socketInstance.connect();
                } else {
                    // Already connected, just join room
                    socketInstance.emit('join', user.id);
                    setIsConnected(true);
                }

            } catch (error) {
                console.error('Socket initialization error:', error);
            }
        };

        initSocket();

        // Cleanup on unmount
        return () => {
            // Don't disconnect, just remove listeners
            // Socket stays alive for app lifetime
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
    };
};

/**
 * Hook for subscribing to socket events
 */
export const useSocketEvent = <T>(eventName: string, callback: (data: T) => void) => {
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on(eventName, callback);

        return () => {
            socket.off(eventName, callback);
        };
    }, [socket, eventName, callback]);
};

/**
 * Get the socket instance directly (for use outside React components)
 */
export const getSocket = () => socketInstance;

/**
 * Disconnect socket (call on logout)
 */
export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};
